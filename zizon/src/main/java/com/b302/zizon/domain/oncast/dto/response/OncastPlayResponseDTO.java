package com.b302.zizon.domain.oncast.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OncastPlayResponseDTO {

    private Long oncastId;
    private String scriptOne;
    private String scriptTwo;
    private String scriptThree;
    private String scriptFour;
    private String ttsOne;
    private String ttsTwo;
    private String ttsThree;
    private String ttsFour;
    private String djName;
    private List<GetMusicDTO> music;
}
