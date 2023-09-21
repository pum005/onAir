package com.toy.kafka.domain.music.dto.response;

import com.toy.kafka.domain.music.dto.Tracks;
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