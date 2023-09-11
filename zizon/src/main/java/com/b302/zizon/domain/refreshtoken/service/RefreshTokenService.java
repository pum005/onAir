package com.b302.zizon.domain.refreshtoken.service;

import com.b302.zizon.domain.refreshtoken.dto.RefreshTokenCheckDTO;
import com.b302.zizon.domain.refreshtoken.entity.RefreshToken;
import com.b302.zizon.domain.refreshtoken.repository.RefreshTokenRepository;
import com.b302.zizon.util.exception.CommonException;
import com.b302.zizon.util.exception.CustomExceptionStatus;
import com.b302.zizon.util.jwt.JwtUtil;
import com.b302.zizon.util.response.DataResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final JwtUtil jwtUtil;
    @Value("${jwt.secret}")
    private String secretKey;

    @Transactional
    public void saveTokenInfo(Long employeeId, String refreshToken, String accessToken) {
        refreshTokenRepository.save(new RefreshToken(String.valueOf(employeeId), refreshToken, accessToken));
    }

    @Transactional
    public void removeRefreshToken(String accessToken) {
        refreshTokenRepository.findByAccessToken(accessToken)
                .ifPresent(refreshToken -> refreshTokenRepository.delete(refreshToken));
    }

    public String checkRefreshToken(RefreshTokenCheckDTO refreshTokenCheckDTO){
        String refreshToken = refreshTokenCheckDTO.getRefreshToken();
        String userId = String.valueOf(refreshTokenCheckDTO.getUserId());

        // 레디스에서 토큰 꺼냄
        String storedRefreshToken = redisTemplate.opsForValue().get(userId);

        if(storedRefreshToken.isEmpty()){ // 유저의 토큰이 없으면(만료)
            throw new CommonException(CustomExceptionStatus.NOT_FOUND_REFRESHTOKEN);
        }else if(!storedRefreshToken.equals(refreshToken)){ // 유저의 토큰이 일치하지 않으면
            throw new CommonException(CustomExceptionStatus.NOT_MATCH_REFRESHTOKEN);
        } else{
            String accessToken = jwtUtil.createAccessJwt(Long.valueOf(userId), secretKey);
            return accessToken;
        }

    }
}
