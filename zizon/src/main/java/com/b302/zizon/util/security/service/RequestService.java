package com.b302.zizon.util.security.service;


import com.b302.zizon.util.security.dto.SignInResponse;
import com.b302.zizon.util.security.dto.TokenRequest;
import com.b302.zizon.util.security.dto.TokenResponse;

public interface RequestService<T> {
    SignInResponse redirect(TokenRequest tokenRequest);
    TokenResponse getToken(TokenRequest tokenRequest);
    T getUserInfo(String accessToken);
    TokenResponse getRefreshToken(String provider, String refreshToken);
}
