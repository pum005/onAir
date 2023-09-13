package com.b302.zizon.domain.music.controller;

import com.b302.zizon.domain.music.dto.MusicInfoResponseDTO;
import com.b302.zizon.domain.music.dto.MyMusicBoxAddRequestDTO;
import com.b302.zizon.domain.music.dto.SpotifySearchResultDTO;
import com.b302.zizon.domain.music.service.MusicService;
import com.b302.zizon.domain.music.service.MyMusicBoxService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MusicController {

    private final MyMusicBoxService myMusicBoxService;
    private final MusicService musicService;

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

    // 내 보관함에 음악 삭제
    @DeleteMapping("/my-musicbox")
    public ResponseEntity<?> deleteMyMusicBoxMusic(@RequestBody MyMusicBoxAddRequestDTO myMusicBoxAddRequestDTO){
        myMusicBoxService.deleteMusicMyMusicBox(myMusicBoxAddRequestDTO.getMusicId());
        
        return ResponseEntity.status(200).body("음악 삭제 완료");
    }

    // 스포티파이 음악 검색
    @GetMapping("/search/spotify")
    public List<SpotifySearchResultDTO> searchMusic(@RequestParam String title) {
        return musicService.searchSpotifyMusicList(title);
    }

    // 유튜브 검색
    @GetMapping("/search/youtube")
    public ResponseEntity<?> searchMusicByYoutube(@RequestParam String musicTitle,
                                                  @RequestParam String musicArtist, @RequestParam long spotifyMusicDuration) {
        return ResponseEntity.ok(musicService.findVideo(musicTitle, musicArtist, spotifyMusicDuration));
    }
}
