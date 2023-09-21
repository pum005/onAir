package com.toy.kafka.domain.playlist.dto;

import lombok.Data;

@Data
public class AddPlaylistMusicDTO {

    private Long playlistMetaId;
    private Long musicId;

}
