package com.b302.zizon.domain.playlist.exception;

public class UnauthorizedPlaylistAccessException extends RuntimeException {
    public UnauthorizedPlaylistAccessException(String message) {
        super(message);
    }
}

