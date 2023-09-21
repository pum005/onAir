package com.b302.zizon.domain.playlist.exception;

public class PlaylistNotFoundException extends IllegalArgumentException{
    public PlaylistNotFoundException(String message) {
        super(message);
    }
}
