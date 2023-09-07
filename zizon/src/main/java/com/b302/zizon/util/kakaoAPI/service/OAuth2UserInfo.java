package com.b302.zizon.util.kakaoAPI.service;

public interface OAuth2UserInfo {
    String getProviderId();
    String getProvider();
    String getEmail();
    String getName();

    String getImagePath();
}
