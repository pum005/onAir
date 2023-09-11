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

import java.io.IOException;
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

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    @PostMapping("oauth/login")
    public ResponseEntity<?> Login(@RequestBody Map<String, Object> data) throws IOException {

        Map<String, Object> result = userService.oauthLogin((String) data.get("access"));


//        Optional<RefreshToken> byUserUserNo = refreshTokenRepository.findByUserUserNo(UserInfo.getUserNo());
//
//        if(byUserUserNo.isPresent()){
//            RefreshToken currentRefreshToken = byUserUserNo.get(); // 현재 유저의 리프레시 토큰 꺼내옴
//
//            currentRefreshToken.setRefreshToken(refreshToken); // 전부 새롭게 저장
//            currentRefreshToken.setExpirationDate(LocalDateTime.now().plusDays(14));
//            currentRefreshToken.setCreateDate(LocalDateTime.now());
//
//            refreshTokenRepository.save(currentRefreshToken); // db에 저장
//
//        } else {
//            RefreshToken refreshTokenUser = RefreshToken.builder() // 리프레시 토큰 빌더로 생성
//                    .user(UserInfo)
//                    .refreshToken(refreshToken)
//                    .expirationDate(LocalDateTime.now().plusDays(14))
//                    .build();
//
//            refreshTokenRepository.save(refreshTokenUser); // 리프레시 토큰 저장.
//        }

        return ResponseEntity.status(200).body(result);
    }
}
