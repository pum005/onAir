import configparser
import spotipy
from spotipy import SpotifyOAuth

SCOPE = ['user-library-read',
         'user-follow-read',
         'user-top-read',
         'playlist-read-private',
         'playlist-read-collaborative',
         'playlist-modify-public',
         'playlist-modify-private']

properties = configparser.ConfigParser()
properties.read('config.ini')

#USER_ID = properties.get('CONFIG', 'USER_ID')
REDIRECT_URI = properties.get('CONFIG', 'REDIRECT_URI')
CLIENT_ID = properties.get('CONFIG', 'CLIENT_ID')
CLIENT_SECRET = properties.get('CONFIG', 'CLIENT_SECRET')

print(REDIRECT_URI)
print(CLIENT_SECRET)
print(CLIENT_ID)

def getAPIObject():
    auth_manager = SpotifyOAuth(
        scope=SCOPE,
        #username=USER_ID,
        redirect_uri=REDIRECT_URI,
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET)

    sp = spotipy.Spotify(auth_manager=auth_manager)

    return sp