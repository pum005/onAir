package com.b302.zizon.domain.music.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MusicInfoDTO {

    private Long musicId;
    private String title;
    private String artist;
    private String duration;
    private String albumCoverUrl;


}
