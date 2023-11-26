package com.b302.zizon.domain.music.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class MusicRecommendRequestDTO {
    private String[] songId;

    public MusicRecommendRequestDTO(String[] songId){
        this.songId = songId;
    }
}
