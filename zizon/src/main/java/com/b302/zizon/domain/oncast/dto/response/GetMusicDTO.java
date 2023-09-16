package com.b302.zizon.domain.oncast.dto.response;

import lombok.Data;

@Data
public class GetMusicDTO {
    private Long musicId;
    private String albumCoverUrl;
    private String title;
    private String artist;
    private int duration;
}
