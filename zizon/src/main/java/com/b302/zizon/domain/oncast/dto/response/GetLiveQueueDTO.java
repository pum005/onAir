package com.b302.zizon.domain.oncast.dto.response;

import com.b302.zizon.domain.music.entity.Music;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
public class GetLiveQueueDTO {

<<<<<<< HEAD
    private int index;
=======
>>>>>>> 0f4dfd7587064bf4367ea96fc18d2056ceb36abc
    private String nickname;
    private String profileImage;
    private String title;
    private List<MusicDTO> musicList;

    @Builder
<<<<<<< HEAD
    public GetLiveQueueDTO(int index, String nickname, String profileImage, String title, List<MusicDTO> musicList) {
        this.index = index;
=======
    public GetLiveQueueDTO(String nickname, String profileImage, String title, List<MusicDTO> musicList) {
>>>>>>> 0f4dfd7587064bf4367ea96fc18d2056ceb36abc
        this.nickname = nickname;
        this.profileImage = profileImage;
        this.title = title;
        this.musicList = musicList;
    }
}
