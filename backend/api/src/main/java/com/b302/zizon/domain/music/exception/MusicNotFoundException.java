package com.b302.zizon.domain.music.exception;

public class MusicNotFoundException extends IllegalArgumentException{
    public MusicNotFoundException(String message) {
        super(message);
    }
}

