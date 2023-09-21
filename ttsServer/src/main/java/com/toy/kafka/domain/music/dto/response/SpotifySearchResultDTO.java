package com.toy.kafka.domain.music.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpotifySearchResultDTO {

  private String musicTitle;
  private String musicTitleEn;
  private String musicArtist;
  private String musicArtistEn;
  private String musicAlbum;
  private String musicImage;
  private String musicReleaseDate;
  private long spotifyMusicDuration;
}
