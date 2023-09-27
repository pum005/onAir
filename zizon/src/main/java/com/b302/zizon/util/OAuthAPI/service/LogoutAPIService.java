package com.b302.zizon.util.OAuthAPI.service;

import java.util.Map;

public interface LogoutAPIService {

    String kakaoUnlinkLogout(String accessToken, String type);
}
