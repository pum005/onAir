package com.b302.zizon.domain.music.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SearchResponseDTO {

  private Tracks tracks;
}