package com.b302.zizon.domain.user.service;

import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.domain.user.repository.UserRepository;
import com.b302.zizon.util.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    @Value("${jwt.secret}")
    private String secretKey;
    private final RedisTemplate<String, String> redisTemplate;

    public Long getUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userId = (Long) principal;

        return userId;
    }


    @Transactional
    public Map<String, Object> oauthLogin(String privateAccess){

        Optional<User> byPrivateAccess = userRepository.findByPrivateAccess(privateAccess);

        if(byPrivateAccess.isEmpty()){
            throw new IllegalArgumentException("해당 유저가 존재하지 않습니다.");
        }

        User user = byPrivateAccess.get();

        // 로그인 성공
        String accessToken = jwtUtil.createAccessJwt(user.getUserId(), secretKey); // 토큰 발급해서 넘김
        String refreshToken = jwtUtil.createRefreshToken(secretKey, user); // 리프레시 토큰 발급해서 넘김

        Map<String, Object> result = new HashMap<>();

        result.put("accessToken", accessToken);
        result.put("refreshToken", refreshToken);
        result.put("accountType", user.getAccountType());
        result.put("nickname", user.getNickname());
        result.put("profileImage", user.getProfileImage());
        result.put("userId", user.getUserId());

        if(user.getAccountType().equals("kakao")){
            result.put("message", "카카오 로그인 성공");
        }else if(user.getAccountType().equals("naver")){
            result.put("message", "네이버 로그인 성공");
        }

        return result;
    }

    @Transactional
    public Map<String, Object> logout(){
        Long userId = getUserId();

        redisTemplate.delete(String.valueOf(userId));

        Map<String, Object> result = new HashMap<>();
        result.put("message", "로그아웃 성공");

        return result;
    }
}
