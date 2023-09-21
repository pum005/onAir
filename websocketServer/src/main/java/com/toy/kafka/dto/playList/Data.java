package com.toy.kafka.dto.playList;

import lombok.AllArgsConstructor;
import lombok.ToString;

import java.io.Serializable;

@lombok.Data
@AllArgsConstructor
@ToString
public class Data implements Serializable {

    private String state;
    private int seq;
    private PlayListDto playListDto;
}
