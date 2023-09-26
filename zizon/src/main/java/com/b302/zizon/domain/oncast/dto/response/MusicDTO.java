package com.b302.zizon.domain.oncast.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
public class MusicDTO   {

    private String albumCoverUrl;
    private String title;
    private String artist;

    @Builder
    public MusicDTO(String albumCoverUrl, String title, String artist) {
        this.albumCoverUrl = albumCoverUrl;
        this.title = title;
        this.artist = artist;
    }
}
