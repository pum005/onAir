package com.toy.kafka.dto.playList;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class IntroDto {
    private String type;
    private String path;
    private int length;
}
