package com.b302.zizon.domain.music.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AccessTokenResponse {

  private String access_token;
  private String token_type;
  private int expires_in;

}
