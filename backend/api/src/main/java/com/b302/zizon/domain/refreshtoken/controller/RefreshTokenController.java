package com.b302.zizon.domain.refreshtoken.controller;

import com.b302.zizon.domain.refreshtoken.dto.RefreshTokenCheckDTO;
import com.b302.zizon.domain.refreshtoken.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class RefreshTokenController {

    private final RefreshTokenService refreshTokenService;

    @PostMapping("/token/refresh")
    public ResponseEntity<?> refreshTokenCheck(@RequestBody RefreshTokenCheckDTO refreshTokenCheckDTO){
        Map<String, Object> result = refreshTokenService.checkRefreshToken(refreshTokenCheckDTO);

        return ResponseEntity.status(200).body(result);
    }
}
