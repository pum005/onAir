from datetime import datetime
from pyspark.sql import SparkSession
from pyspark.ml.feature import VectorAssembler
from pyspark.ml.clustering import KMeans
from pyspark.sql.functions import concat_ws
from pyspark.sql.types import StructType, StructField, IntegerType, DoubleType, StringType
from pyspark.ml.evaluation import ClusteringEvaluator
from kmeans_feature_imp import KMeansInterp
import pandas as pd

# Step 1: Create a SparkSession
spark = SparkSession.builder\
        .master("yarn")\
        .appName("KMeansExample")\
        .config("spark.sql.warehouse.dir", "/user/hive/warehouse")\
        .enableHiveSupport()\
        .getOrCreate()

# Step 2: Load the data
data = spark.read.csv("hdfs:///test/mapreduce.csv", header=True, inferSchema=True)
feat_data = data.toPandas()

# Step 3: Select the feature columns (exclude the first column)
feature_cols = [col for col in data.columns if col.startswith('feat_')]
assembler = VectorAssembler(inputCols=feature_cols, outputCol="features")
data = assembler.transform(data)

k_silhouette_scores = []

k_values = range(2, 15)

for k in k_values:
    kmeans = KMeans().setK(k)
    model = kmeans.fit(data)

    #Make predictions
    predictions = model.transform(data)

    #Evaluation
    evaluator = ClusteringEvaluator()
    silhouette_score = evaluator.evaluate(predictions)

    k_silhouette_scores.append(silhouette_score)

optimal_k = k_values[k_silhouette_scores.index(max(k_silhouette_scores))]

# Step 4: Create and train the K-Means model
kmeans = KMeans().setK(optimal_k)  # Set the number of clusters (you can change this)
model = kmeans.fit(data)

feat_data = feat_data[feat_data.columns.intersection(feature_cols)]

kms = KMeansInterp(
        n_clusters=optimal_k,
        ordered_feature_names=feat_data.columns.tolist(),
        feature_importance_method='wcss_min'
    ).fit(feat_data.values)

#Step 5-1: Get feature importance of each cluster and write to hdfs
cluster_ids = list(kms.feature_importances_.keys())

arr = []

for cid in cluster_ids:
    #arr.append([cid] + list(map(str, kms.feature_importances_[cid][:len(feature_cols)])))
    tmp = [cid]
    
    for featid in range(len(feature_cols)):
        tmp.append(str(kms.feature_importances_[cid][featid][1]))
    
    arr.append(tmp)

df = spark.createDataFrame(arr)
interp_col_names = ["Cluster"] + feature_cols

for i, col_name in enumerate(df.columns):
    df = df.withColumnRenamed(col_name, interp_col_names[i])

kms_hdfs_path = "hdfs:///test/kmeans_feature_importance.csv"

df.write.mode("overwrite").csv(kms_hdfs_path)

# Step 5-2: Get cluster centers and assign labels
cluster_centers = model.clusterCenters()
results = model.transform(data)

results = results.withColumn("audio_feature_id", results["audio_feature_id"].cast("string"))
results = results.withColumn("prediction", results["prediction"].cast("string"))
results = results.withColumn("popularity", results["popularity"].cast("string"))

# Cast double columns to string
for col_name in feature_cols:
    results = results.withColumn(col_name, results[col_name].cast("string"))

# Step 6: Write results to HDFS as a CSV file with cluster number, song_id, and centroid value
results = results.withColumn("output", concat_ws(",", "audio_feature_id", "prediction", "popularity", *feature_cols))
results.select("output").write.mode("overwrite").csv("hdfs:///test/k_means_output.csv")

# Create a DataFrame with cluster number and centroid values using original feature column names
cluster_centers_with_number = [(i,) + tuple(map(float, center)) for i, center in enumerate(cluster_centers)]
schema = StructType([StructField("Cluster", IntegerType(), False)] +
                    [StructField(col, DoubleType(), False) for col in feature_cols])
centroid_data = spark.createDataFrame(cluster_centers_with_number, schema)

# Step 7: Create a temporary view for k_means_results
results.createOrReplaceTempView("k_means_results")
df.createOrReplaceTempView("k_means_interp_view")

# Step 8: Generate a timestamp for the table name
timestamp = datetime.now().strftime("%Y%m%d")
new_table_name = f"k_means_data_points_{timestamp}"
centroid_table_name = f"k_means_centroids_{timestamp}"

# Drop the existing centroid table if it exists
spark.sql(f"DROP TABLE IF EXISTS {centroid_table_name}")

# Create a Hive table for centroids with the timestamped name and the specified schema
spark.sql(f"""
    CREATE TABLE {centroid_table_name} (
        Cluster INT,
    {', '.join([f"{col} DOUBLE" for col in feature_cols])}
    )
    STORED AS PARQUET
""")

# Insert data into the new Hive table for centroids from the DataFrame
centroid_data.createOrReplaceTempView("k_means_centroids")
insert_centroids_sql = f"""
    INSERT INTO {centroid_table_name}
    SELECT * FROM k_means_centroids
"""
spark.sql(insert_centroids_sql)

# Define the schema for the Hive table for data points
hive_table_fields = [
    StructField("Cluster", StringType(), False),
    StructField("Song_ID", StringType(), False),
    StructField("Popularity", DoubleType(), False)
]

# Append StructFields for each feature column in feature_cols
hive_table_fields.extend([StructField(col, DoubleType(), False) for col in feature_cols])

# Create Hive tables for data points and centroids
spark.sql(f"""
    DROP TABLE IF EXISTS {new_table_name}
""")
spark.sql(f"""
    CREATE TABLE {new_table_name} (
        Cluster STRING,
        Song_ID STRING,
        Popularity DOUBLE,
    {', '.join([f"{col} DOUBLE" for col in feature_cols])}
    )
    STORED AS PARQUET
""")

# Insert data into the new Hive table for data points from the temporary view
feature_select_expr = [f"cast({col} as double) AS {col}" for col in feature_cols]
insert_sql = f"""
    INSERT INTO {new_table_name}
    SELECT
        prediction AS Cluster,
        audio_feature_id AS Song_ID,
        cast(popularity as double) AS Popularity,
        {', '.join(feature_select_expr)}
    FROM k_means_results
"""
spark.sql(insert_sql)

#Interpretation Table Creation
interp_table_name = f"k_means_interp_{timestamp}"
spark.sql(f"""
        DROP TABLE IF EXISTS {interp_table_name}
        """)
spark.sql(f"""
        CREATE TABLE {interp_table_name} (
        Cluster STRING,
        {', '.join([f"{col} DOUBLE" for col in feature_cols])}
        )
        STORED AS PARQUET
""")
interp_insert_sql = f"""
    INSERT INTO {interp_table_name}
    SELECT 
        cluster AS Cluster,
        {', '.join([f"CAST({col} AS DOUBLE)" for col in feature_cols])}
    FROM k_means_interp_view
"""
spark.sql(interp_insert_sql)

# Step 9: Stop the SparkSession
spark.stop()

