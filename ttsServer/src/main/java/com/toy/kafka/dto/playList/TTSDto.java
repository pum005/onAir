package com.toy.kafka.dto.playList;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TTSDto {
    private String type;
    private String script;
    private String path;
    private int length;
}
