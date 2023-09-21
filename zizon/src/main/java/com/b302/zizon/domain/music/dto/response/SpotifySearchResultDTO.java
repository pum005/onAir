package com.b302.zizon.domain.music.dto.response;

import lombok.*;

@Data
@Builder
public class SpotifySearchResultDTO {

  private String musicTitle;
  private String musicTitleEn;
  private String musicArtist;
  private String musicArtistEn;
  private String musicAlbum;
  private String musicImage;
  private String musicReleaseDate;
  private String externalIds;
  private long spotifyMusicDuration;
}
