package com.b302.zizon.util.exception.controller;

import com.amazonaws.services.kms.model.NotFoundException;
import com.b302.zizon.domain.music.exception.MusicBoxNotFoundException;
import com.b302.zizon.domain.music.exception.MusicNotFoundException;
import com.b302.zizon.domain.oncast.exception.OncastAlreadyCreateException;
import com.b302.zizon.domain.oncast.exception.OncastNotFoundException;
import com.b302.zizon.domain.oncast.exception.UnauthorizedOncastAccessException;
import com.b302.zizon.domain.playlist.exception.PlaylistMusicNotFoundException;
import com.b302.zizon.domain.playlist.exception.PlaylistNotFoundException;
import com.b302.zizon.domain.playlist.exception.UnauthorizedPlaylistAccessException;
import com.b302.zizon.domain.user.exception.UserNotFoundException;
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

    // 유저 못찾음
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Object> handleUserNotFoundException(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 음악 못찾음
    @ExceptionHandler(MusicNotFoundException.class)
    public ResponseEntity<Object> handleMusicNotFoundException(MusicNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 온캐스트 못찾음
    @ExceptionHandler(OncastNotFoundException.class)
    public ResponseEntity<Object> handleOncastNotFoundException(OncastNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 해당 유저의 온캐스트가 아닌 경우(권한 x)
    @ExceptionHandler(UnauthorizedOncastAccessException.class)
    public ResponseEntity<Object> handleUnauthorizedOncastAccess(UnauthorizedOncastAccessException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    // 해당 유저의 보관함에 음악이 없는 경우
    @ExceptionHandler(MusicBoxNotFoundException.class)
    public ResponseEntity<Object> handleMusicBoxNotFoundAccess(MusicBoxNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 유저의 플레이리스트에 해당 음악이 없는 경우
    @ExceptionHandler(PlaylistMusicNotFoundException.class)
    public ResponseEntity<Object> handlePlaylistMusicNotFoundAccess(PlaylistMusicNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 해당 유저의 플레이리스트가 아닌 경우(권한 x)
    @ExceptionHandler(UnauthorizedPlaylistAccessException.class)
    public ResponseEntity<Object> handleUnauthorizedOncastAccess(UnauthorizedPlaylistAccessException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    // 해당 유저의 플레이리스트가 없는 경우
    @ExceptionHandler(PlaylistNotFoundException.class)
    public ResponseEntity<Object> handlePlaylistNotFoundAccess(PlaylistNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 해당 유저가 이미 온캐스트를 만들었을 경우
    @ExceptionHandler(OncastAlreadyCreateException.class)
    public ResponseEntity<Object> handleOncastAlreadyCreateException(OncastAlreadyCreateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Object> NotFountException(final NotFoundException ex) {
        //log.warn("error", ex);

        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
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