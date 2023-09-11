package com.b302.zizon.domain.refreshtoken.controller;

import com.b302.zizon.domain.refreshtoken.dto.RefreshTokenCheckDTO;
import com.b302.zizon.domain.refreshtoken.service.RefreshTokenService;
import com.b302.zizon.util.exception.CommonException;
import com.b302.zizon.util.response.DataResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class RefreshTokenController {

    private final RefreshTokenService refreshTokenService;

    @GetMapping("/token/refresh")
    public DataResponse<Map<String, Object>> refreshTokenCheck(@RequestBody RefreshTokenCheckDTO refreshTokenCheckDTO){
        try{
            String accessToken = refreshTokenService.checkRefreshToken(refreshTokenCheckDTO);
            Map<String, Object> result = new HashMap<>();
            result.put("accessToken", accessToken);

            DataResponse<Map<String, Object>> response = new DataResponse<>(200, "리프레시 토큰 재발급 성공");

            response.setData(result);

            return response;
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }

    }
}
