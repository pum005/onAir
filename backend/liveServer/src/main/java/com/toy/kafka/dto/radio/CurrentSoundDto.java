package com.toy.kafka.dto.radio;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CurrentSoundDto {
    private String type;
//    private long typePlayedTime;
    private String path;
//    private long startTime;
    private long playedTime;
    private long length;
    private String title;
    private String artist;
    private String image;
    private String script;
    private long seq;
    private String djName;
}