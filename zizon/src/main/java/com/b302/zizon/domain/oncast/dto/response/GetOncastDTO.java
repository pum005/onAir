package com.b302.zizon.domain.oncast.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class GetOncastDTO {
    private Long oncastId;
    private String djName;
    private String theme;
    private String createTime;
    private String title;
    private boolean shareCheck;
    private boolean selectCheck;
    private List<GetMusicDTO> musicList = new ArrayList<>();

    @Builder

    public GetOncastDTO(Long oncastId, String djName, String theme, String createTime, String title, boolean shareCheck, boolean selectCheck, List<GetMusicDTO> musicList) {
        this.oncastId = oncastId;
        this.djName = djName;
        this.theme = theme;
        this.createTime = createTime;
        this.title = title;
        this.shareCheck = shareCheck;
        this.selectCheck = selectCheck;
        this.musicList = musicList;
    }
}
