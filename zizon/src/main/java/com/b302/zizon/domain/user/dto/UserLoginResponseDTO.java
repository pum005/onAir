package com.b302.zizon.domain.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class UserLoginResponseDTO {
    private Long uesrId;
    private String accessToken;
    private String refreshToken;
    private String accountType;
    private String nickname;
    private String profileImage;
    private boolean createCheck;

    @Builder
    public UserLoginResponseDTO(Long uesrId, String accessToken, String refreshToken, String accountType, String nickname, String profileImage, boolean createCheck) {
        this.uesrId = uesrId;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.accountType = accountType;
        this.nickname = nickname;
        this.profileImage = profileImage;
        this.createCheck = createCheck;
    }
}
