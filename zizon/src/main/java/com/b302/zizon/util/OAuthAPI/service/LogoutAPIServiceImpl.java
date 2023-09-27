package com.b302.zizon.util.OAuthAPI.service;

import com.b302.zizon.util.OAuthAPI.service.LogoutAPIService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class LogoutAPIServiceImpl implements LogoutAPIService {

    public LogoutAPIServiceImpl(){}
    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String kakaoClientId;
//    @Value("${kakao.logout-redirect-uri}")
    private String kakaoLogoutRedirectUri = "http://localhost:3000";

    @Override
    public String kakaoUnlinkLogout(String accessToken, String type){

        //카카오톡 연동 해제 로직
        RestTemplate restTemplate = new RestTemplate();
        //Headers 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        // HTTP Request 생성
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // 카카오 연동 해제 API 호출
        //연동해제 : https://kapi.kakao.com/v1/user/unlink
        //로그아웃 : https://kapi.kakao.com/v1/user/logout
        String logoutUrl = "https://kauth.kakao.com/v1/user/logout";

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(logoutUrl)
            .queryParam("client_id", kakaoClientId)
            .queryParam("logout_redirect_uri", kakaoLogoutRedirectUri);

         ResponseEntity<String> kakaoResponse = restTemplate.exchange(
            builder.toUriString(),
            HttpMethod.GET,
            null,
            String.class
        );

        System.out.println(kakaoResponse.toString());

        return null;
    }

}
