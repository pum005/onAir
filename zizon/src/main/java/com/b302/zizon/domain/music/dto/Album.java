package com.b302.zizon.domain.music.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Album {

  private String album_type;
  private List<Artist> artists;
  private String href;
  private String id;
  private List<Image> images;
  private String name;
  private String release_date;
  private String release_date_precision;
  private String type;
  private String uri;
  private boolean is_playable;
  private int total_tracks;
  private String album_group;
}
