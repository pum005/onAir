package com.b302.zizon.util.exception.controller;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.security.auth.login.LoginException;
import java.nio.file.AccessDeniedException;

@ControllerAdvice
@Slf4j
public class ExceptionController {
    @ExceptionHandler({
            IllegalArgumentException.class
    })
    public ResponseEntity<Object> BadRequestException(final IllegalArgumentException ex) {
        //log.warn("error", ex);

        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler({AccessDeniedException.class})
    public ResponseEntity handleAccessDeniedException(final Exception ex) {
        //log.warn("error", ex);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }

    @ExceptionHandler({LoginException.class, ExpiredJwtException.class, JwtException.class})
    public ResponseEntity handleUnauthorizedException(final Exception ex) {
        //log.warn("error", ex);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }
}