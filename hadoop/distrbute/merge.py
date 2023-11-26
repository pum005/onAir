import sqlite3, time
import pandas as pd
import configparser
import spotipy
from spotipy.oauth2 import SpotifyOAuth

from spotifyAPI import getAPIObject

pd.set_option('display.max_rows', 10)
pd.set_option('display.max_columns', 10)
sqlite_file = "C:/Users/SSAFY/Downloads/archive/spotify.sqlite"

conn = sqlite3.connect(sqlite_file)
conn.text_factory = bytes

cursor = conn.cursor()

#컬럼명 읽기
cursor.execute("PRAGMA table_info(audio_features)")

columns = cursor.fetchall()

column_names = [column[1].decode('utf-8') for column in columns]

#print(column_names)

start = time.time()
sql_read_feature = "SELECT id, acousticness, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, valence FROM audio_features"
sql_read_popularity = "SELECT id, popularity from tracks"

popularity_df = pd.read_sql_query(sql_read_popularity, conn)
feature_df = pd.read_sql_query(sql_read_feature, conn)

#Pop(Feat + Popularity)
pop_df = pd.merge(popularity_df, feature_df, on='id')
pop_df = pop_df[pop_df['id'].notna()]
pop_df['id'] = pop_df['id'].str.decode('utf-8')

#레코드 읽기
#cursor.execute(sql_read)
#rows = cursor.fetchall()
kpop_df = pd.read_csv ('C:/Users/SSAFY/Downloads/karchive/single_album_track_data.csv')

kpop_df = kpop_df.drop('Unnamed: 0', axis=1).drop('Artist', axis=1).drop('Artist_Id', axis=1).drop('Single_Album_Id', axis=1).drop('Single_Album_Name', axis=1).drop('Track_Title', axis=1).drop('key', axis=1).drop('mode', axis=1).drop('duration_ms', axis=1).drop('time_signature', axis=1)
kpop_df.rename(columns={"Track_Id":"id"}, inplace=True)
kpop_df['popularity'] = None

kpop_df = kpop_df[kpop_df['id'].notna()]

#final_df = pd.concat([pop_df, kpop_df])
#final_df['id'] = final_df['id'].str.decode('utf-8')
# final_df.to_csv('C:/Users/최중국/Downloads/map1001.csv', sep=',', index=False)

#컬럼 별로 잘 들어갔는지 체크
#verify_row = final_df.loc[final_df['id'] == '3szqGZtiiS8hmIPcT9qBgh']

end = time.time()
print((end - start) * 10 ** 3, "ms")

cursor.close()
conn.close()

#Kpop Spotify Popularity 추가하는 코드
sp = getAPIObject()
batch_size = 50

kpop_track_ids = kpop_df['id'].tolist()

for i in range(0, len(kpop_track_ids), batch_size):
    print("{batch_loop}: " + str(i/50))

    track_ids_batch = kpop_track_ids[i:i + batch_size]

    print(track_ids_batch)
    tracks_info = sp.tracks(track_ids_batch)

    print(tracks_info)
    print()

    # Extract popularity information into a dictionary
    popularity_dict = {track['id']: track['popularity'] for track in tracks_info['tracks']}

    # Update the 'popularity' column in the DataFrame for the corresponding tracks
    for track_id in track_ids_batch:
        kpop_df.loc[kpop_df['id'] == track_id, 'popularity'] = popularity_dict.get(track_id, None)

kpop_df = kpop_df[kpop_df['popularity'].notna()]

final_df = pd.concat([pop_df, kpop_df], axis=0)
final_df = final_df[final_df['id'].notna()]

final_df.to_csv('C:/Users/SSAFY/Downloads/map1001.csv', sep=',', index=False)