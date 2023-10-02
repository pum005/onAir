package com.b302.zizon.domain.oncast.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
public class MusicDTO   {

<<<<<<< HEAD
    private Long musicId;
=======
>>>>>>> 0f4dfd7587064bf4367ea96fc18d2056ceb36abc
    private String albumCoverUrl;
    private String title;
    private String artist;

    @Builder
<<<<<<< HEAD
    public MusicDTO(Long musicId, String albumCoverUrl, String title, String artist) {
        this.musicId = musicId;
=======
    public MusicDTO(String albumCoverUrl, String title, String artist) {
>>>>>>> 0f4dfd7587064bf4367ea96fc18d2056ceb36abc
        this.albumCoverUrl = albumCoverUrl;
        this.title = title;
        this.artist = artist;
    }
}
