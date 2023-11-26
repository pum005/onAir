package com.b302.zizon.domain.music.exception;

public class MusicBoxNotFoundException extends IllegalArgumentException{
    public MusicBoxNotFoundException(String message) {
        super(message);
    }
}
