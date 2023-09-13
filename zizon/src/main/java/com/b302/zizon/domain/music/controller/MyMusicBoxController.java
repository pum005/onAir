package com.b302.zizon.domain.music.controller;

import com.b302.zizon.domain.music.dto.MusicInfoResponseDTO;
import com.b302.zizon.domain.music.dto.MyMusicBoxAddRequestDTO;
import com.b302.zizon.domain.music.service.MyMusicBoxService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MyMusicBoxController {

    private final MyMusicBoxService myMusicBoxService;

    // 내 음악보관함, 플레이리스트 가져오기
    @GetMapping("/my-musicbox")
    public ResponseEntity<?> getMyMusicBox(){
        Map<String, Object> result = myMusicBoxService.getMyMusicBoxAndPlaylist();

        return ResponseEntity.status(200).body(result);
    }

    // 내 음악보관함의 노래 상세정보 가져오기
    @GetMapping("/my-musicbox/info")
    public ResponseEntity<?> getMyMusicBoxInfo(){
        List<MusicInfoResponseDTO> myMusicBoxInfo = myMusicBoxService.getMyMusicBoxInfo();

        return ResponseEntity.status(200).body(myMusicBoxInfo);
    }

    // 내 보관함에 음악 추가
    @PostMapping("/my-musicbox")
    public ResponseEntity<?> addMyMusicBoxMusic(@RequestBody MyMusicBoxAddRequestDTO myMusicBoxAddRequestDTO){
        myMusicBoxService.addMusicMyMusicBox(myMusicBoxAddRequestDTO.getMusicId());

        return ResponseEntity.status(200).body("음악 추가 완료");
    }
}
