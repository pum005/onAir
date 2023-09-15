package com.b302.zizon.domain.playlist.controller;

import com.b302.zizon.domain.music.entity.Music;
import com.b302.zizon.domain.playlist.dto.AddPlaylistMusicDTO;
import com.b302.zizon.domain.playlist.service.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PlaylistController {

    private final PlaylistService playlistService;

    // 플레이리스트에 음악 추가
    @PostMapping("playlist/music")
    public ResponseEntity<?> addPlaylistMusic(@RequestBody AddPlaylistMusicDTO addPlaylistMusicDTO){
        playlistService.addPlaylistMusic(addPlaylistMusicDTO);

        return ResponseEntity.status(HttpStatus.OK).body("플레이리스트 음악 추가 성공");
    }
}
