package com.b302.zizon.util.OAuthAPI.service;

import java.util.Map;

public interface KakaoAPIService {
    public String getKakaoAccessToken(String authorize_code);

    Map<String, Object> getKakaoUserInfo(String access_token);

//    String kakaoUnlinkLogout(KakaoLog kaokaoLog, String type);
}
