package com.b302.zizon.domain.oncast.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class GetOncastDTO {
    private String createTime;
    private String title;
    private List<GetMusicDTO> musicList = new ArrayList<>();
}
