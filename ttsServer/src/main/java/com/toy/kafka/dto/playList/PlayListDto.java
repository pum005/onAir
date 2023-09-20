package com.toy.kafka.dto.playList;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PlayListDto {

    private TTSDto ttsOne;
    private TTSDto ttsTwo;
    private TTSDto ttsThree;
    private TTSDto ttsFour;
    private MusicDto musicOne;
    private MusicDto musicTwo;
    private MusicDto musicThree;
}
