package com.b302.zizon.domain.music.dto.response;

import com.b302.zizon.domain.music.dto.Tracks;
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