package com.toy.kafka.domain.music.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Image {

  private int height;
  private String url;
  private int width;

}
