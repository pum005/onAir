package com.b302.zizon.domain.music.service;

import com.b302.zizon.domain.music.dto.MusicInfoDTO;
import com.b302.zizon.domain.music.entity.MyMusicBox;
import com.b302.zizon.domain.music.repository.MusicRepository;
import com.b302.zizon.domain.music.repository.MyMusicBoxRepository;
import com.b302.zizon.domain.playlist.entity.MyPlaylistMeta;
import com.b302.zizon.domain.playlist.repository.MyPlaylistMetaRepository;
import com.b302.zizon.domain.playlist.repository.MyPlaylistRepository;
import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MyMusicBoxService {

    private final UserRepository userRepository;
    private final MyMusicBoxRepository myMusicBoxRepository;
    private final MyPlaylistRepository myPlaylistRepository;
    private final MyPlaylistMetaRepository myPlaylistMetaRepository;
    private final MusicRepository musicRepository;

    public Long getUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userId = (Long) principal;

        return userId;
    }

    // 재생시간 포맷
    public static String convertSecondsToMinSec(int seconds) {
        int minutes = seconds / 60;
        int remainingSeconds = seconds % 60;
        return String.format("%d:%02d", minutes, remainingSeconds);
    }

    
    // 내 음악 보관함, 플리 전부 가져오기
    public Map<String, Object> getMyMusicBoxAndPlaylist(){
        Map<String, Object> result = new HashMap<>();

        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

        // 내 음악 전부 가져오기
        List<MyMusicBox> byUserUserId = myMusicBoxRepository.findByUserUserId(user.getUserId());

        // 만약에 보관한 음악이 없으면
        if(byUserUserId.size() == 0){
            result.put("my_music_box", 0);
            return result;
        }

        result.put("my_music_box", byUserUserId.size());

        // 재생목록 정보 가져오기
        List<Map<String, Object>> playlistInfo = myPlaylistMetaRepository.findByUserUserId(user.getUserId()).stream()
                .map(meta -> {
                    Map<String, Object> info = new HashMap<>();
                    info.put("playlistName", meta.getPlaylistName());
                    info.put("playlistCount", meta.getPlaylistCount());
                    info.put("playlistImage", meta.getPlaylistImage());
                    return info;
                })
                .collect(Collectors.toList());

        result.put("playlist_info", playlistInfo);

        return result;
    }

    // 내 음악 보관함 상세정보 가져오기
    public List<MusicInfoDTO> getMyMusicBoxInfo(){
        Map<String, Object> result = new HashMap<>();

        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

        List<MyMusicBox> getMyMusicBox = myMusicBoxRepository.findByUserUserId(user.getUserId());

        if(getMyMusicBox.size() == 0){
            throw new IllegalArgumentException("보관함에 노래가 없습니다.");
        }

        // 노래 정보 가져오기
        List<MusicInfoDTO> collect = getMyMusicBox.stream()
                .map(info -> {
                    String formattedDuration = convertSecondsToMinSec(info.getMusic().getDuration());
                    return new MusicInfoDTO(  // 'return' 추가
                            info.getMusic().getMusicId(),
                            info.getMusic().getTitle(),
                            info.getMusic().getArtist(),
                            formattedDuration,
                            info.getMusic().getAlbumCoverUrl());
                })
                .collect(Collectors.toList());

        return collect;
    }
}
