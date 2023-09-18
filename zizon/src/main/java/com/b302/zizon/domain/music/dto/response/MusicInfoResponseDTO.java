package com.b302.zizon.domain.music.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MusicInfoResponseDTO {

    private Long musicId;
    private String title;
    private String artist;
    private int duration;
    private String albumCoverUrl;
    private String youtubeVideoId;

    @Builder
    public MusicInfoResponseDTO(Long musicId, String title, String artist, int duration, String albumCoverUrl, String youtubeVideoId) {
        this.musicId = musicId;
        this.title = title;
        this.artist = artist;
        this.duration = duration;
        this.albumCoverUrl = albumCoverUrl;
        this.youtubeVideoId = youtubeVideoId;
    }
}
