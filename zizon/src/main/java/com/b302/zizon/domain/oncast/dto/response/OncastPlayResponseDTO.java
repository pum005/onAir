package com.b302.zizon.domain.oncast.dto.response;

import com.b302.zizon.domain.music.entity.Music;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OncastPlayResponseDTO {

    private String scriptOne;
    private String scriptTwo;
    private String scriptThree;
    private String scriptFour;
    private String ttsOne;
    private String ttsTwo;
    private String ttsThree;
    private String ttsFour;
    private List<Music> music;


}
