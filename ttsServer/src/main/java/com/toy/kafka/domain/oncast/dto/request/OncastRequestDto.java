package com.toy.kafka.domain.oncast.dto.request;

import com.toy.kafka.domain.music.entity.ThemeEnum;
import lombok.Data;

@Data
public class OncastRequestDto {

    private Long oncastCreateDataId; //온캐스트 생성데이터 고유 id

    private Long oncastId; // 온캐스트 고유 id

    private ThemeEnum theme; // 선택한 테마

    private String story; // 사연

    private String djName; // dj
}
