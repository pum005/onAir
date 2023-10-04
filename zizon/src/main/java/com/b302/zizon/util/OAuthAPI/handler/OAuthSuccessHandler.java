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

        response.sendRedirect("https://j9b302.p.ssafy.io/success?access=" + assessToken);
//        response.sendRedirect("http://localhost:3000/success?access=" + assessToken);
    }

}
