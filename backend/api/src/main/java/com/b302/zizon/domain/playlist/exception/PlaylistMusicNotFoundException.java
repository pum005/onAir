package com.b302.zizon.domain.playlist.exception;

public class PlaylistMusicNotFoundException extends IllegalArgumentException{
    public PlaylistMusicNotFoundException(String message) {
        super(message);
    }
}
