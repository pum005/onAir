package com.b302.zizon.util.security.service;

import com.b302.zizon.domain.user.entity.UserRepository;
import com.b302.zizon.domain.user.enums.AuthProvider;
import com.b302.zizon.exception.BadRequestException;
import com.b302.zizon.util.security.SecurityUtil;
import com.b302.zizon.util.security.dto.SignInResponse;
import com.b302.zizon.util.security.dto.TokenRequest;
import com.b302.zizon.util.security.dto.TokenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final KakaoRequestService kakaoRequestService;
    private final NaverRequestService naverRequestService;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;

    public SignInResponse redirect(TokenRequest tokenRequest){
        if(AuthProvider.KAKAO.getAuthProvider().equals(tokenRequest.getRegistrationId())){
            return kakaoRequestService.redirect(tokenRequest);
        } else if(AuthProvider.NAVER.getAuthProvider().equals(tokenRequest.getRegistrationId())){
            return naverRequestService.redirect(tokenRequest);
        }

        throw new BadRequestException("not supported oauth provider");
    }

    public SignInResponse refreshToken(TokenRequest tokenRequest){
        String userId = (String) securityUtil.get(tokenRequest.getRefreshToken()).get("userId");
        String provider = (String) securityUtil.get(tokenRequest.getRefreshToken()).get("provider");
        String oldRefreshToken = (String) securityUtil.get(tokenRequest.getRefreshToken()).get("refreshToken");

        if(!userRepository.existsByIdAndAuthProvider(userId, AuthProvider.findByCode(provider))){
            throw new BadRequestException("CANNOT_FOUND_USER");
        }

        TokenResponse tokenResponse = null;
        if(AuthProvider.KAKAO.getAuthProvider().equals(provider.toLowerCase())){
            tokenResponse = kakaoRequestService.getRefreshToken(provider, oldRefreshToken);
        } else if(AuthProvider.NAVER.getAuthProvider().equals(provider.toLowerCase())){
            tokenResponse = naverRequestService.getRefreshToken(provider, oldRefreshToken);
        }

        String accessToken = securityUtil.createAccessToken(
                userId, AuthProvider.findByCode(provider.toLowerCase()), tokenResponse.getAccessToken());

        return SignInResponse.builder()
                .authProvider(AuthProvider.findByCode(provider.toLowerCase()))
                .kakaoUserInfo(null)
                .accessToken(accessToken)
                .refreshToken(null)
                .build();
    }
}
