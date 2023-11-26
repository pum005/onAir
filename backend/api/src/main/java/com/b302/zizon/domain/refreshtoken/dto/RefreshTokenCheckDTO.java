package com.b302.zizon.domain.refreshtoken.dto;

import lombok.Data;

@Data
public class RefreshTokenCheckDTO {

    private Long userId;
    private String refreshToken;
}
