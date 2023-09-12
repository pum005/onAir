package com.b302.zizon.domain.music.controller;

import com.b302.zizon.domain.music.service.MyMusicBoxService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MyMusicBoxController {

    private final MyMusicBoxService myMusicBoxService;

    @GetMapping("/my-musicbox")
    public ResponseEntity<?> getMyMusicBox(){
        Map<String, Object> result = myMusicBoxService.getMyMusicBoxAndPlaylist();

        return ResponseEntity.status(200).body(result);
    }
}
