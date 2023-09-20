package com.toy.kafka.dto.playList;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PlayListDto {

    private TTSDto ttsOne;
    private MusicDto musicOne;
    private TTSDto ttsTwo;
    private MusicDto musicTwo;
    private TTSDto ttsThree;
    private MusicDto musicThree;
    private TTSDto ttsFour;
}
