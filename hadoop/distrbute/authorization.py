import tekore as tk

def authorize():
    CLIENT_ID = "2721a5cc2cca43b5bf41cb824a4ac323"
    CLIENT_SECRET = "999e01f4dd974aca86db9a4adca85991"
    app_token = tk.request_client_token(CLIENT_ID, CLIENT_SECRET)

    return tk.Spotify(app_token)