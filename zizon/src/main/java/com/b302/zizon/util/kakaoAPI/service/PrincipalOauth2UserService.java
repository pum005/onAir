package com.b302.zizon.util.kakaoAPI.service;


import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.domain.user.repository.UserRepository;
import com.b302.zizon.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.ui.context.Theme;

import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class PrincipalOauth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder encoder;
    private final UserService userService;

    private final int dailyCheckCoin = 500;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException{
        OAuth2User oAuth2User = super.loadUser(userRequest);
        //log.info("getAttributes : {}", oAuth2User.getAttributes());

        OAuth2UserInfo oAuth2UserInfo = null;

        String provider = userRequest.getClientRegistration().getRegistrationId();

        if(provider.equals("kakao")){
            oAuth2UserInfo  = new KakaoUserInfo((Map) oAuth2User.getAttributes());
        }

        String providerId = oAuth2UserInfo.getProviderId();
        String email = oAuth2UserInfo.getEmail();
        String loginId = provider + "_" + providerId;
        String nickname = oAuth2UserInfo.getName();
        String profileImage = oAuth2UserInfo.getImagePath();
        if(profileImage == null){
            profileImage = "https://damda.s3.ap-northeast-2.amazonaws.com/user-profileImage/profile.jpg";
        }

        Optional<User> optionalUser = userRepository.findByKakaoEmail(email);
        User user = null;

        if(optionalUser.isEmpty()){
            //카카오 유저 생성
            user = User.builder()
                    .accountType("KAKAO")
                    .email(email)
                    .userPw(encoder.encode(loginId))
                    .nickname(nickname)
                    .profileImage(profileImage)
                    .build();
            
            user = userRepository.save(user);

        }


        //유저 정보를 필요할때 그때 사용한다.
        return new PrincipalDetails(user, oAuth2User.getAttributes(), userRequest.getAccessToken().getTokenValue());

    }

}
