package com.b302.zizon.domain.refreshtoken.controller;

import com.b302.zizon.domain.refreshtoken.dto.RefreshTokenCheckDTO;
import com.b302.zizon.util.response.DataResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class RefreshTokenController {


    @GetMapping("/token/refresh")
    public DataResponse<Map<String, Object>> refreshTokenCheck(@RequestBody RefreshTokenCheckDTO refreshTokenCheckDTO){
        System.out.println(refreshTokenCheckDTO.toString());
        return new DataResponse<>(200, "성공");
    }
}
