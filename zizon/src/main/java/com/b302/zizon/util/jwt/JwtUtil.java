package com.b302.zizon.util.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.concurrent.TimeUnit;

public class JwtUtil {

    private static Long acExpiredMs = 1000 * 60 * 60L; // 액세스 토큰의 만료 시간(30분) * 48 * 30 = 30일
    private static Long rfExpiredMs = 1000 * 60 * 60 * 24 * 14L; // 리프레쉬 토큰의 만료 시간(14일)
    private static StringRedisTemplate redisTemplate;



    // 유저 pk 꺼내기
    public static Long getUserNo(String token, String secretKey){
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token)
                .getBody().get("userNo", Long.class);
    }

    // 토큰 만료 체크
    public static boolean isExpired(String token, String secretKey){
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return false;  // 토큰 파싱에 성공하면, 만료되지 않았으므로 false를 반환.
        } catch (ExpiredJwtException e) {
            // 만료된 토큰으로 인해 예외가 발생하면, 만료된 것으로 간주하고 true를 반환.
            return true;
        }
    }

    // 액세스 토큰 생성
    public static String createAccessJwt(Long userNo, String secretKey){
        Claims claims = Jwts.claims();
        claims.put("userNo", userNo);

        return Jwts.builder() // 액세스 토큰을 생성
                .setClaims(claims) // 유저의 pk값
                .setIssuedAt(new Date(System.currentTimeMillis())) // 현재 시간
                .setExpiration(new Date(System.currentTimeMillis() + acExpiredMs)) // 언제까지
                .signWith(SignatureAlgorithm.HS256, secretKey) // 뭐로 사인됐는지
                .compact();
    }

    // 리프레쉬 토큰 생성
    public static String createRefreshToken(String secretKey){
        Claims claims = Jwts.claims();

        String refreshToken = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + rfExpiredMs))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();


        return refreshToken;

    }
}
