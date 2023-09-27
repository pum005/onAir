package com.b302.zizon.util.OAuthAPI.controller;

import com.b302.zizon.domain.refreshtoken.repository.RefreshTokenRepository;
import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.domain.user.repository.UserRepository;
import com.b302.zizon.domain.user.service.UserService;
import com.b302.zizon.util.jwt.JwtUtil;
import com.b302.zizon.util.response.DataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class OAuth2Controller {

    @Value("${jwt.secret}")
    private String secretKey;
    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String kakaoClientId;
//    @Value("${kakao.logout-redirect-uri}")
    private String kakaoLogoutRedirectUri = "http://localhost:3000";


    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    @PostMapping("oauth/login")
    public ResponseEntity<?> Login(@RequestBody Map<String, Object> data, HttpServletResponse response) throws IOException {

        Map<String, Object> result = userService.oauthLogin((String) data.get("access"), response);

        return ResponseEntity.status(200).body(result);
    }

    @PostMapping("oauth/logout")
    public ResponseEntity<?> Logout(){
        String logoutUrl = "https://kauth.kakao.com/oauth/logout";

    UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(logoutUrl)
        .queryParam("client_id", kakaoClientId)
        .queryParam("logout_redirect_uri", kakaoLogoutRedirectUri);

    Map<String, String> response = new HashMap<>();
    response.put("logoutUrl", builder.toUriString());

    return ResponseEntity.ok(response);
    }

}
