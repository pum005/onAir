package com.toy.kafka.domain.music.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Artist {

  private ExternalUrls external_urls;
  private String href;
  private String id;
  private String name;
  private String type;
  private String uri;
}
