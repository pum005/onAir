package com.b302.zizon.domain.playlist.controller;

import com.b302.zizon.domain.music.entity.Music;
import com.b302.zizon.domain.playlist.dto.AddPlaylistMusicDTO;
import com.b302.zizon.domain.playlist.dto.MakePlaylistRequestDTO;
import com.b302.zizon.domain.playlist.dto.PlayPlaylistResponseDTO;
import com.b302.zizon.domain.playlist.dto.PlaylistInfoResponseDTO;
import com.b302.zizon.domain.playlist.service.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PlaylistController {

    private final PlaylistService playlistService;

    // 플레이리스트에 음악 추가
    @PostMapping("playlist/music")
    public ResponseEntity<?> addPlaylistMusic(@RequestBody AddPlaylistMusicDTO addPlaylistMusicDTO){
        Map<String, Object> result = playlistService.addPlaylistMusic(addPlaylistMusicDTO);

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    // 플레이리스트 생성하기
    @PostMapping("playlist")
    public ResponseEntity<?> makePlaylist(@RequestBody MakePlaylistRequestDTO makePlaylistRequestDTO){
        Map<String, Object> result = playlistService.MakePlaylist(makePlaylistRequestDTO);

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    // 내 플레이리스트 호출하기
    @GetMapping("playlist")
    public ResponseEntity<?> getPlaylist(){
        List<PlaylistInfoResponseDTO> playlist = playlistService.getPlaylist();

        return ResponseEntity.status(HttpStatus.OK).body(playlist);
    }

    // 플레이리스트 재생하기
    @GetMapping("playlist/{playlistMeta_id}")
    public ResponseEntity<?> playPlaylist(@PathVariable Long playlistMeta_id){
        List<PlayPlaylistResponseDTO> music = playlistService.playPlaylist(playlistMeta_id);

        return ResponseEntity.status(HttpStatus.OK).body(music);
    }

    // 플레이리스트 삭제하기
    @DeleteMapping("playlist/{playlistMeta_id}")
    public ResponseEntity<?> deletePlaylist(@PathVariable Long playlistMeta_id){
        Map<String, Object> result = playlistService.deletePlaylist(playlistMeta_id);

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    // 플레이리스트 안에 있는 음악 삭제하기
    @DeleteMapping("playlist/music")
    public ResponseEntity<?> deletePlaylistMusic(@RequestBody AddPlaylistMusicDTO deletePlaylistMusicDTO){
        Map<String, Object> result = playlistService.deletePlaylistMusic(deletePlaylistMusicDTO);

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
