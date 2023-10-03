package com.toy.kafka.dto.playList;

import lombok.AllArgsConstructor;
import lombok.ToString;

@lombok.Data
@AllArgsConstructor
@ToString
public class Data {

    private String state;
    private long seq;
    private String djName;
    private PlayListDto playListDto;
}
