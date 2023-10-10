from flask import Flask, request, jsonify
from flask_cors import CORS
import os, pickle as pk, pandas as pd, numpy as np
from flask_expects_json import expects_json
from pyhive import hive
from datetime import datetime
from sentiment import vad_calculate
import scipy.spatial.distance as distance, json
from flask_restx import Api, Resource
import numpy as np, random

app = Flask(__name__)
api = Api(app)
CORS(app)

hive_con = hive.Connection(
    host='52.78.65.222',
    port=10000,
    username='APP',
    password='mine',
    database='default',
    auth='LDAP'
)


pca_model = pk.load(open("pca.pkl", 'rb'))
schema = {
  "type": "object",
  "properties": {
    "story": { "type": "string" },
    "popularity": { "type": "number" },
    "acousticness": {"type": "number"},
    "danceability": {"type": "number"},
    "instrumentalness": {"type": "number"},
    "liveness": {"type": "number"},
    "loudness": {"type": "number"},
    "speechiness": {"type": "number"},
    "tempo": {"type": "number"}
  },
  "required": ["story", "popularity", "acousticness", "danceability", "instrumentalness", "liveness", "loudness", "speechiness", "tempo"]
}

@app.route('/hadoop', methods=['GET'])
def index():
    return ""

@app.route('/hadoop/hello', methods=['GET'])
def hello():
    return "hello world!"

@app.route('/hadoop/ssafy', methods=['GET'])
def ssafy():
    return "ssafy"

@app.route('/hadoop/songs', methods=['POST'])
@expects_json(schema)
def recommendation():
    print(1)
    global pca_model
    req = request.get_json()

    story = req['story']
    v_score, a_score = vad_calculate(story)

    x = [req['acousticness'], req['danceability'], a_score, req['instrumentalness'], req['liveness'],
         req['loudness'], req['speechiness'], req['tempo'], v_score]

    pca_model = pk.load(open("pca.pkl", 'rb'))
    result = pca_model.transform(np.array(x).reshape(1, -1))[0]

    cursor = hive_con.cursor()
    date = datetime.today().strftime("%Y%m%d")
    date = "20231005"

    table_name = "k_means_centroids_" + date
    cursor.execute(f"DESCRIBE {table_name}")
    table_schema = cursor.fetchall()

    feat_cols = [column[0] for column in table_schema if column[0].startswith('feat_')]

    # Create a comma-separated list of 'feat_x' columns
    feat_columns_str = ', '.join(feat_cols)

    #test_query = f"SELECT song_id, cluster, popularity, {feat_columns_str} FROM {table_name}"
    # Construct the SQL query to calculate cosine similarity and select the closest cluster
    query = f"SELECT cluster, " + " + ".join([f"feat_{i} * {result[i]}" for i in range(len(feat_cols))]) + \
            f" AS similarity FROM {table_name}"

    cursor = hive_con.cursor()
    cursor.execute(query)

    closest_cluster = None
    max_similarity = -1  # Initialize with a low value

    # Iterate through the results to find the closest cluster
    for row in cursor:
        cluster = row[0]
        similarity = abs(row[1])

        # Check if this cluster has a higher similarity
        if similarity > max_similarity:
            max_similarity = similarity
            closest_cluster = cluster

    #feat_query = f"SELECT song_id, cluster, popularity, feat_0, feat_1, feat_2, feat_3, feat_4, feat_5, feat_6 FROM k_means_data_points_20231002 WHERE cluster = {closest_cluster}"
    
    # Create the SELECT clause for feature columns based on feature_cols
    select_clause = ", ".join([f"{col}" for col in feat_cols])

    # Replace feat_0, feat_1, etc. with the actual column names in your DataFrame
    feat_query = f"SELECT song_id, cluster, popularity, {select_clause} FROM k_means_data_points_{date} WHERE cluster = {closest_cluster}"
    #interp_query = f"SELECT {select_clause} FROM k_means_interp_{date} WHERE cluster = {closest_cluster}"
    interp_query = f"SELECT {select_clause} FROM k_means_interp_{date} WHERE cluster = {closest_cluster}"

    cursor.execute(interp_query)
    feat_impt = list(cursor.fetchone())
    weighted_result = np.multiply(result, feat_impt)

    closest_rows = []
    cursor.execute(feat_query)

    # Iterate through the cursor to calculate cosine similarity for each row
    for hive_row in cursor:
        # Extract the feature values from the Hive row (assuming they start at index 3)
        hive_features = hive_row[3:]
        weighted_feat_impt = np.multiply(feat_impt, hive_features)

        # Calculate cosine similarity between x and the Hive row
        cosine_similarity = 1 - distance.cosine(weighted_result, weighted_feat_impt)

        # Append the (row, cosine_similarity) pair to the list
        closest_rows.append((hive_row[0], cosine_similarity * 0.6 + hive_row[2] * 0.4))

    # Sort the list by cosine similarity in descending order (highest similarity first)
    closest_rows.sort(key=lambda x: x[1], reverse=True)
    
    minimum_cnt = min(50, len(closest_rows))
    
    random_indexes = random.sample(range(minimum_cnt), 10)

    # Get the top three closest rows
    top_fifty_closest_rows = closest_rows[:min(50, len(closest_rows))]
    
    song_ids = []

    for idx in random_indexes:
        song_ids.append(top_fifty_closest_rows[idx][0])
    
    # Extract only the song IDs from the pairs
    #song_ids = [pair[0] for pair in top_fifty_closest_rows]
    response_data = {'song_ids': song_ids}

    # Convert the song IDs to a JSON string

    return jsonify(response_data), 200

if __name__ == "__main__":
    from waitress import serve
    serve(app, host='0.0.0.0', port=5000)#, threaded=True)
#    app.run(host="0.0.0.0", port=5000, debug=True)

