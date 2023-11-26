package com.toy.kafka.dto.playList;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class MusicDto implements Serializable {
    private String type;
    private String path;
    private long length;
    private String artist;
    private String title;
    private String image;
}
