package com.b302.zizon.domain.playlist.service;

import com.b302.zizon.domain.music.entity.Music;
import com.b302.zizon.domain.music.entity.MyMusicBox;
import com.b302.zizon.domain.music.repository.MusicRepository;
import com.b302.zizon.domain.music.repository.MyMusicBoxRepository;
import com.b302.zizon.domain.playlist.dto.AddPlaylistMusicDTO;
import com.b302.zizon.domain.playlist.dto.MakePlaylistRequestDTO;
import com.b302.zizon.domain.playlist.dto.PlayPlaylistResponseDTO;
import com.b302.zizon.domain.playlist.dto.PlaylistInfoResponseDTO;
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

import java.util.*;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    public Long getUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userId = (Long) principal;

        return userId;
    }

    private final UserRepository userRepository;
    private final PlaylistRepository playlistRepository;
    private final PlaylistMetaRepository playlistMetaRepository;
    private final MyMusicBoxRepository myMusicBoxRepository;
    private final MusicRepository musicRepository;

    // 플리에 음악 추가
    @Transactional
    public Map<String, Object> addPlaylistMusic(AddPlaylistMusicDTO addPlaylistMusicDTO){
        Map<String, Object> result = new HashMap<>();

        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

        Long musicId = addPlaylistMusicDTO.getMusicId();
        Long playlistMetaId = addPlaylistMusicDTO.getPlaylistMetaId();

        Optional<Music> byMusic = musicRepository.findById(musicId);
        if(byMusic.isEmpty()){
            throw new IllegalArgumentException("노래 정보가 없습니다.");
        }
        Music music = byMusic.get();


        Optional<MyMusicBox> byMusicMusicIdAndUserUserId = myMusicBoxRepository.findByMusicMusicIdAndUserUserId(musicId, userId);
        if(byMusicMusicIdAndUserUserId.isEmpty()){
            throw new IllegalArgumentException("보관함에 없는 노래입니다.");
        }

        Optional<PlaylistMeta> byPlaylistMetaIdAndUserUserId = playlistMetaRepository.findByPlaylistMetaIdAndUserUserId(playlistMetaId, userId);
        if(byPlaylistMetaIdAndUserUserId.isEmpty()){
            throw new IllegalArgumentException("유저의 플레이리스트가 없습니다.");
        }

        PlaylistMeta playlistMeta = byPlaylistMetaIdAndUserUserId.get();

        Optional<Playlist> byPlaylistMetaPlaylistMetaIdAndMusicMusicId = playlistRepository.findByPlaylistMetaPlaylistMetaIdAndMusicMusicId(playlistMetaId, musicId);
        if(byPlaylistMetaPlaylistMetaIdAndMusicMusicId.isPresent()){
            result.put("message", "이미 플레이리스트에 추가된 음악입니다.");
            return result;
        }

        // 플리 데이터 생성 후 저장
        Playlist playlist = Playlist.builder()
                .playlistMeta(playlistMeta)
                .music(music)
                .build();
        playlistRepository.save(playlist);

        if(playlistMeta.getPlaylistImage() == null){
            playlistMeta.registPlaylistImage(music.getAlbumCoverUrl());
        }
        playlistMeta.plusCountPlaylistCount();

        result.put("message", "플레이리스트 음악 추가 성공.");
        return result;
    }
    
    // 플레이리스트 생성
    @Transactional
    public Map<String, Object> MakePlaylist(MakePlaylistRequestDTO makePlaylistRequestDTO){
        Map<String, Object> result = new HashMap<>();
        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

        PlaylistMeta build = PlaylistMeta.builder()
                .playlistName(makePlaylistRequestDTO.getPlaylistName())
                .user(user)
                .playlistCount(0)
                .build();
        
        playlistMetaRepository.save(build);

        result.put("message", "플레이리스트 생성 성공.");
        return result;
    }

    // 플레이리스트 정보 가져오기
    public List<PlaylistInfoResponseDTO> getPlaylist(){
        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

        List<PlaylistMeta> byUserUserId = playlistMetaRepository.findByUserUserId(userId);
        int index = 1;
        List<PlaylistInfoResponseDTO> list = new ArrayList<>();
        for(PlaylistMeta pm : byUserUserId){
            list.add(PlaylistInfoResponseDTO.builder()
                    .playlistImage(pm.getPlaylistImage())
                    .playlistName(pm.getPlaylistName())
                    .playlistCount(pm.getPlaylistCount())
                    .playlistMetaId(pm.getPlaylistMetaId())
                    .index(index).build());
            index += 1;
        }
        return list;
    }

    // 플레이리스트 재생하기
    public List<PlayPlaylistResponseDTO> playPlaylist(Long playlistMetaId){
        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

        Optional<PlaylistMeta> byPlaylistMeta = playlistMetaRepository.findById(playlistMetaId);
        if(byPlaylistMeta.isEmpty()){
            throw new IllegalArgumentException("해당 플레이리스트가 없습니다.");
        }

        PlaylistMeta playlistMeta = byPlaylistMeta.get();
        if(!playlistMeta.getUser().getUserId().equals(userId)){
            throw new IllegalArgumentException("해당 유저의 플레이리스트가 아닙니다.");
        }

        List<Playlist> byPlaylist = playlistRepository.findByPlaylistMetaPlaylistMetaId(playlistMetaId);

        List<PlayPlaylistResponseDTO> music = new ArrayList<>();

        for(Playlist p : byPlaylist){
            PlayPlaylistResponseDTO build = PlayPlaylistResponseDTO.builder()
                    .musicId(p.getMusic().getMusicId())
                    .title(p.getMusic().getTitle())
                    .artist(p.getMusic().getArtist())
                    .duration(p.getMusic().getDuration())
                    .albumCoverUrl(p.getMusic().getAlbumCoverUrl())
                    .youtubeVideoId(p.getMusic().getYoutubeVideoId())
                    .build();
            music.add(build);
        }

        return music;
    }
    
}
