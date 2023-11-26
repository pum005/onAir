package com.toy.kafka.dto.radio;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class StoryDto {

    private String story;
    private String storyContent;
    private List<String> storyContentList;
    private String storyReaction;
    private String storyOutro;
    private String ttsPath;
}
