package com.b302.zizon.domain.music.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.b302.zizon.domain.music.dto.response.MusicInfoResponseDTO;
import com.b302.zizon.domain.music.entity.Music;
import com.b302.zizon.domain.music.entity.MyMusicBox;
import com.b302.zizon.domain.music.repository.MusicRepository;
import com.b302.zizon.domain.music.repository.MyMusicBoxRepository;
import com.b302.zizon.domain.playlist.entity.Playlist;
import com.b302.zizon.domain.playlist.entity.PlaylistMeta;
import com.b302.zizon.domain.playlist.repository.PlaylistMetaRepository;
import com.b302.zizon.domain.playlist.repository.PlaylistRepository;
import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final PlaylistRepository playlistRepository;
    private final PlaylistMetaRepository playlistMetaRepository;
    private final MusicRepository musicRepository;

    public Long getUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userId = (Long) principal;

        return userId;
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
        List<Map<String, Object>> playlistInfo = playlistMetaRepository.findByUserUserId(user.getUserId()).stream()
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
    public Map<String, Object> getMyMusicBoxInfo(){
        Map<String, Object> result = new HashMap<>();

        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

        List<MyMusicBox> getMyMusicBox = myMusicBoxRepository.findByUserUserId(user.getUserId());

        if(getMyMusicBox.size() == 0){
            result.put("message", "보관함에 노래가 없습니다.");
            return result;
        }

        // 노래 정보 가져오기
        List<MusicInfoResponseDTO> collect = getMyMusicBox.stream()
                .map(info -> {
                    return new MusicInfoResponseDTO(  // 'return' 추가
                            info.getMusic().getMusicId(),
                            info.getMusic().getTitle(),
                            info.getMusic().getArtist(),
                            info.getMusic().getDuration(),
                            info.getMusic().getYoutubeVideoId(),
                            info.getMusic().getAlbumCoverUrl());
                })
                .collect(Collectors.toList());

        result.put("musicInfo", collect);
        return result;
    }

    @Transactional
    // 내 보관함에 음악 추가하기
    public Map<String, Object> addMusicMyMusicBox(Long musicId){
        Map<String, Object> result = new HashMap<>();
        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

        Optional<Music> byMusic = Optional.ofNullable(musicRepository.findById(musicId)
                .orElseThrow(() -> new NotFoundException("음악을 찾을 수 없습니다.")));

        Music music = byMusic.get();

        Optional<MyMusicBox> byMusicMusicId = myMusicBoxRepository.findByMusicMusicIdAndUserUserId(musicId, userId);

        if(byMusicMusicId.isPresent()){
            result.put("message", "이미 보관함에 있는 음악입니다.");
            return result;
        }

        MyMusicBox build = MyMusicBox.builder()
                .user(user)
                .music(music).build();
        
        MyMusicBox save = myMusicBoxRepository.save(build);
        result.put("message", "음악 추가 완료");
        return result;
    }
    
    // 내 보관함에 음악 삭제하기
    @Transactional
    public Map<String, Object> deleteMusicMyMusicBox(Long musicId){
        Map<String, Object> result = new HashMap<>();
        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

        Optional<Music> byMusicId = musicRepository.findById(musicId);
        if(byMusicId.isEmpty()){
            throw new IllegalArgumentException("해당 음악이 존재하지 않습니다.");
        }

        Music music = byMusicId.get();

        Optional<MyMusicBox> fineMyMusicBox = Optional.ofNullable(myMusicBoxRepository.findByMusicMusicIdAndUserUserId(musicId, userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저에게 음악이 없습니다.")));

        MyMusicBox myMusicBox = fineMyMusicBox.get();

        // 내 보관함에서 음악 삭제
        myMusicBoxRepository.delete(myMusicBox);

        // ---- 내 플레이리스트에 있는 음악 삭제 로직 ----
        result.put("message", "음악 삭제 완료");
        List<PlaylistMeta> playlistMetas = playlistMetaRepository.findByUserUserId(user.getUserId());

        if(playlistMetas.size() == 0){
            return result;
        }

        for(PlaylistMeta pm : playlistMetas){
            Optional<Playlist> playlist = playlistRepository.findByPlaylistMetaPlaylistMetaIdAndMusicMusicId(pm.getPlaylistMetaId(), musicId);
            if(playlist.isPresent() && playlist.get().getMusic().getMusicId().equals(musicId)){
                playlistRepository.delete(playlist.get());
                pm.minusCountPlaylistCount();
                // 플리의 대표 이미지가 지운 음악의 이미지와 같으면 안에 존재하는 다른 음악으로 바꿔야함.
                if(pm.getPlaylistImage().equals(music.getAlbumCoverUrl())){
                    List<Playlist> byPlaylistMeta = playlistRepository.findByPlaylistMetaPlaylistMetaId(pm.getPlaylistMetaId());
                    // 사이즈 0이면 대표이미지 널로 바꿈
                    if(byPlaylistMeta.size() == 0){
                        pm.changePlaylistImageNull();
                    }
                    // 사이즈 널이 아니면 0번째 리스트 이미지로 바꿈
                    else{
                        pm.registPlaylistImage(byPlaylistMeta.get(0).getMusic().getAlbumCoverUrl());
                    }
                }
            }
        }
        return result;
    }
}
