package com.b302.zizon.domain.oncast.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
public class MusicDTO   {

    private Long musicId;
    private String albumCoverUrl;
    private String title;
    private String artist;

    @Builder
    public MusicDTO(Long musicId, String albumCoverUrl, String title, String artist) {
        this.musicId = musicId;
        this.albumCoverUrl = albumCoverUrl;
        this.title = title;
        this.artist = artist;
    }
}
