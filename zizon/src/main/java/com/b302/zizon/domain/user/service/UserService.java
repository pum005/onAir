package com.b302.zizon.domain.user.service;

import com.b302.zizon.domain.user.dto.UserUpdateRequestDTO;
import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.domain.user.repository.UserRepository;
import com.b302.zizon.util.S3.service.S3UploadService;
import com.b302.zizon.util.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
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
    private final S3UploadService s3UploadService;

    public Long getUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userId = (Long) principal;

        return userId;
    }


    // 소셜 로그인
    @Transactional
    public Map<String, Object> oauthLogin(String privateAccess, HttpServletResponse response){

        Optional<User> byPrivateAccess = userRepository.findByPrivateAccess(privateAccess);

        if(byPrivateAccess.isEmpty()){
            throw new IllegalArgumentException("해당 유저가 존재하지 않습니다.");
        }

        User user = byPrivateAccess.get();

        // 로그인 성공
        String accessToken = jwtUtil.createAccessJwt(user.getUserId(), secretKey); // 토큰 발급해서 넘김
        String refreshToken = jwtUtil.createRefreshToken(secretKey, user); // 리프레시 토큰 발급해서 넘김

        // create a cookie
        Cookie cookie = new Cookie("refreshToken",refreshToken);

        // expires in 7 days
        cookie.setMaxAge(7 * 24 * 60 * 60);

        // optional properties
        cookie.setSecure(false);
        cookie.setHttpOnly(true);
        cookie.setPath("/");

        // add cookie to response
        response.addCookie(cookie);


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


    // 로그아웃
    @Transactional
    public Map<String, Object> logout(){
        Long userId = getUserId();

        redisTemplate.delete(String.valueOf(userId));

        Map<String, Object> result = new HashMap<>();
        result.put("message", "로그아웃 성공");

        return result;
    }

    // 유저 닉네임 변경
    @Transactional
    public Map<String, Object> userNicknameUpdate(UserUpdateRequestDTO userUpdateRequestDTO){
        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

        user.updateNickname(userUpdateRequestDTO.getNickname());

        Map<String, Object> result = new HashMap<>();
        result.put("message", "닉네임 변경 성공");

        return result;
    }

    // 유저 닉네임 중복체크
    public boolean userCheckNickname(String nickname){
        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

        boolean flag = userRepository.existsByNickname(nickname);

        return flag;
    }


    // 유저 프로필사진 변경
    @Transactional
    public Map<String, Object> userProfileImage(MultipartFile multipartFile) throws IOException {
        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

        String profileUrl = s3UploadService.profileSaveFile(multipartFile);

        user.updateprofileImage(profileUrl);

        Map<String, Object> result = new HashMap<>();

        result.put("message", "프로필 사진 변경 성공");

        return result;
    }


}
