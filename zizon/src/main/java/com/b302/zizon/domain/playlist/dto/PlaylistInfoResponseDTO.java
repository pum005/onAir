package com.b302.zizon.domain.playlist.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlaylistInfoResponseDTO {

    private Long playlistMetaId;
    private int index;
    private String playlistImage;
    private String playlistName;
    private int playlistCount;
}
