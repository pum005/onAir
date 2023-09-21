package com.toy.kafka.domain.oncast.dto.response;

import lombok.Builder;

import java.time.LocalDateTime;
@Builder
public class OncastResponseDto {

    private Long oncastId;
    private Long userId;
    private LocalDateTime createTime;
    private boolean shareCheck;
    private boolean deleteCheck;
    private boolean selectCheck;
    private String scriptOne;
    private String scriptTwo;
    private String scriptThree;
    private String scriptFour;
    private String ttsOne;
    private String ttsTwo;
    private String ttsThree;
    private String ttsFour;
    private String oncastMusicOne;
    private String oncastMusicTwo;
    private String oncastMusicThree;


}
