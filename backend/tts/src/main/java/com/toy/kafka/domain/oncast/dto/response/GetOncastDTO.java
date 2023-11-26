package com.toy.kafka.domain.oncast.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class GetOncastDTO {
    private Long oncastId;
    private String createTime;
    private String title;
    private boolean shareCheck;
    private boolean selectCheck;
    private List<GetMusicDTO> musicList = new ArrayList<>();
}
