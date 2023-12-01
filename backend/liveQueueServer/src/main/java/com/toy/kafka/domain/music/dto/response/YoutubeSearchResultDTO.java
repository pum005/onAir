package com.toy.kafka.domain.music.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class YoutubeSearchResultDTO {

  private String musicYoutubeId;
  private long musicLength;
}
