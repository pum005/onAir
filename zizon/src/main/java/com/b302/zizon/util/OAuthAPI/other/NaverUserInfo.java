package com.b302.zizon.util.OAuthAPI.other;

import java.util.Map;

public class NaverUserInfo implements OAuth2UserInfo{
    private Map<String, Object> attributes;

    public NaverUserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getProviderId() {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        return response.get("id").toString();
    }

    @Override
    public String getProvider() {
        return "naver";
    }

    @Override
    public String getEmail() {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        return (String) response.get("email");
    }

    @Override
    public String getName() {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        return (String) response.get("nickname");
    }

    @Override
    public String getImagePath() {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        return (String) response.get("profile_image");
    }
}
