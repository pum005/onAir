package com.b302.zizon.util.jwt;

import com.b302.zizon.domain.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    private static Long acExpiredMs = 1000 * 60 * 60 * 24 * 14L; // 액세스 토큰의 만료 시간(10분)
    private static Long rfExpiredMs = 1000 * 60 * 60 * 24 * 14L; // 리프레쉬 토큰의 만료 시간(14일)
    private final RedisTemplate<String, String> redisTemplate;

    // 유저 pk 꺼내기
    public static Long getUserId(String token, String secretKey){
        try {
            return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token)
                    .getBody().get("userId", Long.class);
        } catch (ExpiredJwtException e) {
            // 만료된 JWT에서도 claims를 가져올 수 있습니다.
            return e.getClaims().get("userId", Long.class);
        }
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

    // 리프레시 토큰 체크
    public String checkRefreshToken(String refreshToken, Long userId){
        try {
            String redisRefreshToken = redisTemplate.opsForValue().get(String.valueOf(userId));
            if (redisRefreshToken.isEmpty()) {
                return "리프레시 토큰 만료";
            } else if (!redisRefreshToken.equals(refreshToken)) {
                return "리프레시 토큰 불일치";
            } else {
                return "리프레시 토큰 일치";
            }
        }catch (Exception e){
            e.printStackTrace();
            return e.getMessage();
        }
    }

    // 액세스 토큰 생성
    public String createAccessJwt(Long userId, String secretKey){
        Claims claims = Jwts.claims();
        claims.put("userId", userId);

        return Jwts.builder() // 액세스 토큰을 생성
                .setClaims(claims) // 유저의 pk값
                .setIssuedAt(new Date(System.currentTimeMillis())) // 현재 시간
                .setExpiration(new Date(System.currentTimeMillis() + acExpiredMs)) // 언제까지
                .signWith(SignatureAlgorithm.HS256, secretKey) // 뭐로 사인됐는지
                .compact();
    }

    // 리프레쉬 토큰 생성
    public String createRefreshToken(Long userId, String secretKey){

        Claims claims = Jwts.claims();

        String refreshToken = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + rfExpiredMs))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();

        // redis에 저장
        redisTemplate.opsForValue().set(
                String.valueOf(userId), // 사용자의 이름을 key로 사용
                refreshToken,             // 리프레쉬 토큰을 value로 사용
                rfExpiredMs,              // 리프레쉬 토큰의 만료 시간
                TimeUnit.MILLISECONDS
        );


        return refreshToken;
    }
}
