package com.toy.kafka.domain.playlist.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlayPlaylistResponseDTO {
    private Long musicId;
    private String title;
    private String artist;
    private Long duration;
    private String youtubeVideoId;
    private String albumCoverUrl;

    public PlayPlaylistResponseDTO(Long musicId, String title, String artist, Long duration, String youtubeVideoId, String albumCoverUrl) {
        this.musicId = musicId;
        this.title = title;
        this.artist = artist;
        this.duration = duration;
        this.youtubeVideoId = youtubeVideoId;
        this.albumCoverUrl = albumCoverUrl;
    }
}
