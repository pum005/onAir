package com.toy.kafka.domain.music.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Tracks {

  private String href;
  private int limit;
  private String next;
  private int offset;
  private String previous;
  private int total;
  private List<Track> items;

}
