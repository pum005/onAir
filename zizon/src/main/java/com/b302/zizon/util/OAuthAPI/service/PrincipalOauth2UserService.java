package com.b302.zizon.util.OAuthAPI.service;


import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.domain.user.repository.UserRepository;
import com.b302.zizon.util.OAuthAPI.other.KakaoUserInfo;
import com.b302.zizon.util.OAuthAPI.other.NaverUserInfo;
import com.b302.zizon.util.OAuthAPI.other.OAuth2UserInfo;
import com.b302.zizon.util.OAuthAPI.other.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class PrincipalOauth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder encoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException{
        OAuth2User oAuth2User = super.loadUser(userRequest);
        //log.info("getAttributes : {}", oAuth2User.getAttributes());

        OAuth2UserInfo oAuth2UserInfo = null;

        String provider = userRequest.getClientRegistration().getRegistrationId();

        if(provider.equals("kakao")){
            oAuth2UserInfo  = new KakaoUserInfo((Map) oAuth2User.getAttributes());
        }else if(provider.equals("naver")){
            oAuth2UserInfo  = new NaverUserInfo((Map) oAuth2User.getAttributes());
        }

        String email = oAuth2UserInfo.getEmail();
        String profileImage = oAuth2UserInfo.getImagePath();
        String accessToken = userRequest.getAccessToken().getTokenValue();

        Optional<User> optionalUser = userRepository.findByEmailAndAccountType(email, provider);
        User user = null;

        if(optionalUser.isEmpty()){
            //유저 생성
            user = User.builder()
                    .accountType(provider)
                    .email(email)
                    .nickname(nNick())
                    .profileImage(profileImage)
                    .accessToken(accessToken)
                    .privateAccess(encoder.encode(accessToken))
                    .build();

            user = userRepository.save(user);

        }else{
            // 최근 로그인 시간 갱신
            user = optionalUser.get();
            user.updateLastLoginDate();
            user.updateAccessToken(accessToken);
            user.updatePrivateAccessToken(encoder.encode(accessToken));
            userRepository.save(user);
        }

        //유저 정보를 필요할때 그때 사용한다.
        return new PrincipalDetails(user, oAuth2User.getAttributes(), accessToken);

    }

    // 닉네임 랜덤 생성
    public String nNick() {
        String text;
        do {
            List<String> nick = Arrays.asList("기분나쁜", "기분좋은", "신바람나는", "상쾌한", "짜릿한", "그리운", "자유로운", "서운한", "울적한", "비참한", "위축되는", "긴장되는", "두려운", "당당한", "배부른", "수줍은", "창피한", "멋있는",
                    "열받은", "심심한", "잘생긴", "이쁜", "시끄러운");
            List<String> name = Arrays.asList("사자", "코끼리", "호랑이", "곰", "여우", "늑대", "너구리", "침팬치", "고릴라", "참새", "고슴도치", "강아지", "고양이", "거북이", "토끼", "앵무새", "하이에나", "돼지", "하마", "원숭이", "물소", "얼룩말", "치타",
                    "악어", "기린", "수달", "염소", "다람쥐", "판다");
            List<String> num = Arrays.asList("1", "2", "3", "4", "5", "6", "7", "8", "9", "0");
            Collections.shuffle(nick);
            Collections.shuffle(name);
            Collections.shuffle(num);

            text = nick.get(0) + name.get(0) + num.get(0) + num.get(1) + num.get(2) + num.get(3) + num.get(4);
        } while (userRepository.existsByNickname(text)); // 닉네임이 이미 존재하면 다시 생성
        return text;
    }

}
