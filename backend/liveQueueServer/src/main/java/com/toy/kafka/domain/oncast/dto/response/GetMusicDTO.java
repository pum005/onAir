package com.toy.kafka.domain.oncast.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GetMusicDTO {
    private Long musicId;
    private String albumCoverUrl;
    private String title;
    private String artist;
    private Long duration;
    private String youtubeId;

    @Builder

    public GetMusicDTO(Long musicId, String albumCoverUrl, String title, String artist, Long duration, String youtubeId) {
        this.musicId = musicId;
        this.albumCoverUrl = albumCoverUrl;
        this.title = title;
        this.artist = artist;
        this.duration = duration;
        this.youtubeId = youtubeId;
    }
}
