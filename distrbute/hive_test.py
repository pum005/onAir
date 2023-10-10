from pyhive import hive
from datetime import datetime
import pandas as pd

hive_con = hive.Connection(
    host='3.36.124.199',
    port=10000,
    username='APP',
    password='mine',
    database='default',
    auth='LDAP'
)

cursor = hive_con.cursor()
date = datetime.today().strftime("%Y%m%d")

test_query='''
select * from k_means_data_points_;
''' + date

cursor.execute(test_query.replace(';', ''))

try:
    output = cursor.fetchall()
except:
    output = None

print(output)