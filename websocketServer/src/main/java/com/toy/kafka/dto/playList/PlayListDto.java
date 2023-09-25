package com.toy.kafka.dto.playList;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
@Builder
public class PlayListDto implements Serializable {
    private String type;
    private String path;
    private Long length;
    private String title;
    private String artist;
    private String image;
    private String script;
}