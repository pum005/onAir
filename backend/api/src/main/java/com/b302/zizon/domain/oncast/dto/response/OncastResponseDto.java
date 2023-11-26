package com.b302.zizon.domain.oncast.dto.response;

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
//    private Music music1;
//    private Music music2;
//    private Music music3;


}
