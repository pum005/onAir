package com.b302.zizon.util.security.controller;

import com.b302.zizon.util.security.dto.SignInResponse;
import com.b302.zizon.util.security.dto.TokenRequest;
import com.b302.zizon.util.security.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @GetMapping("/login/oauth2/code/{registrationId}")
    public ResponseEntity<SignInResponse> redirect(
            @PathVariable("registrationId") String registrationId
            , @RequestParam("code") String code
            , @RequestParam("state") String state) {
        System.out.println(123);
        return ResponseEntity.ok(
                authService.redirect(
                    TokenRequest.builder()
                            .registrationId(registrationId)
                            .code(code)
                            .state(state)
                            .build()));
    }

    @PostMapping("/auth/token")
    public ResponseEntity<SignInResponse> refreshToken(@RequestBody TokenRequest tokenRequest){
        return ResponseEntity.ok(authService.refreshToken(tokenRequest));
    }
}