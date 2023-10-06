package com.b302.zizon.domain.refreshtoken.service;

import com.b302.zizon.domain.refreshtoken.dto.RefreshTokenCheckDTO;
import com.b302.zizon.domain.refreshtoken.repository.RefreshTokenRepository;
import com.b302.zizon.util.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final JwtUtil jwtUtil;
    @Value("${jwt.secret}")
    private String secretKey;

    public Map<String, Object> checkRefreshToken(RefreshTokenCheckDTO refreshTokenCheckDTO){
        String refreshToken = refreshTokenCheckDTO.getRefreshToken();
        String userId = String.valueOf(refreshTokenCheckDTO.getUserId());

        // 레디스에서 토큰 꺼냄
        String storedRefreshToken = redisTemplate.opsForValue().get(userId);

        if(storedRefreshToken.isEmpty()){ // 유저의 토큰이 없으면(만료)
            throw new IllegalArgumentException("유저의 토큰이 없습니다.");
        }else if(!storedRefreshToken.equals(refreshToken)){ // 유저의 토큰이 일치하지 않으면
            throw new IllegalArgumentException("유저의 토큰이 일치하지 않습니다.");
        } else{
            String accessToken = jwtUtil.createAccessJwt(Long.valueOf(userId), secretKey);
            Map<String, Object> result = new HashMap<>();
            result.put("accessToken", accessToken);
            result.put("message", "액세스 토큰 재발급 성공");
            return result;
        }

    }
}
