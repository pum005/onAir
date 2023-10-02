package com.b302.zizon.util.OAuthAPI.handler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
public class OAuthFailHandler implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        System.out.println("실패");
        response.sendRedirect("http://localhost:3000");
<<<<<<< HEAD
//        response.sendRedirect("https://j9b302.p.ssafy.io");
=======
//        response.sendRedirect("https://j9b302.p.ssafy.io"); 서버
>>>>>>> 0f4dfd7587064bf4367ea96fc18d2056ceb36abc
    }
}
