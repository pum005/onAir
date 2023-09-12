package com.b302.zizon.util.OAuthAPI.handler;

import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.util.OAuthAPI.other.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RequiredArgsConstructor
@Slf4j
public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        User UserInfo = principalDetails.getUser(); //PrincipalDetails에서 사용자 정보 가져오기

        String assessToken = UserInfo.getPrivateAccess();


        /*
        RestTemplate restTemplate = new RestTemplate();

        // Headers 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + assessToken);

        // HTTP Request 생성
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // 카카오 연동 해제 API 호출
        //연동해제 : https://kapi.kakao.com/v1/user/unlink
        //로그아웃 : https://kapi.kakao.com/v1/user/logout
        String KakaoRevokeEndpoint = "https://kapi.kakao.com/v1/user/logout";
        ResponseEntity<String> kakaoResponse = restTemplate.exchange(KakaoRevokeEndpoint, HttpMethod.POST, entity, String.class);

        // 에러 처리 (옵션)
        if (kakaoResponse.getStatusCode().isError()) {
            // 연동 해제 실패 처리
            log.error("카카오톡 연동 해제 에러... : {}", kakaoResponse.getBody());
        }

        */
        response.sendRedirect("http://j9b302.p.ssafy.io:3000/success?access=" + assessToken);
    }
}
