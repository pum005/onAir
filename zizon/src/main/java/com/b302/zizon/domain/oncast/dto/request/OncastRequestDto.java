package com.b302.zizon.domain.oncast.dto.request;

import com.b302.zizon.domain.music.entity.ThemeEnum;
import lombok.Data;

@Data
public class OncastRequestDto {

    private String title; // 온캐스트 제목

    private ThemeEnum theme; // 선택한 테마

    private String story; // 사연

    private String djName; // dj
}
