package com.b302.zizon.domain.oncast.dto.response;

import com.b302.zizon.domain.music.entity.Music;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
public class GetLiveQueueDTO {

    private int index;
    private String nickname;
    private String profileImage;
    private String title;
    private List<MusicDTO> musicList;

    @Builder
    public GetLiveQueueDTO(int index, String nickname, String profileImage, String title, List<MusicDTO> musicList) {
        this.index = index;
        this.nickname = nickname;
        this.profileImage = profileImage;
        this.title = title;
        this.musicList = musicList;
    }
}
