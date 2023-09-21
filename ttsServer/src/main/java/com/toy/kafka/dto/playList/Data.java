package com.toy.kafka.dto.playList;

import lombok.AllArgsConstructor;
import lombok.ToString;

@lombok.Data
@AllArgsConstructor
@ToString
public class Data {

    private String state;
    private int seq;
    private PlayListDto playListDto;
}
