package com.b302.zizon.util.security.dto;

import com.b302.zizon.domain.user.enums.AuthProvider;
import lombok.Builder;
import lombok.Getter;

@Getter
public class SignInResponse {
    private AuthProvider authProvider;
    private KakaoUserInfo kakaoUserInfo;
    private NaverUserInfo naverUserInfo;
    private String accessToken;
    private String refreshToken;

    @Builder
    public SignInResponse(
            AuthProvider authProvider
            ,KakaoUserInfo kakaoUserInfo
            ,NaverUserInfo naverUserInfo
            ,String accessToken
            ,String refreshToken
    ){
        this.authProvider = authProvider;
        this.kakaoUserInfo = kakaoUserInfo;
        this.naverUserInfo = naverUserInfo;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
