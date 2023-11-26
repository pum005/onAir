package com.b302.zizon.domain.user.controller;

import com.b302.zizon.domain.user.dto.UserUpdateRequestDTO;
import com.b302.zizon.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    // 닉네임 중복 체크
    @GetMapping("/user/check-nickname")
    public ResponseEntity<?> userCheckNickname(@RequestParam("nickName") String nickname){
        boolean result = userService.userCheckNickname(nickname);

        return ResponseEntity.status(200).body(result);
    }

    // 닉네임 변경
    @PutMapping("/user/nickname/update")
    public ResponseEntity<?> userNicknameUpdate(@RequestBody UserUpdateRequestDTO userUpdateRequestDTO){
        Map<String, Object> result = userService.userNicknameUpdate(userUpdateRequestDTO);

        return ResponseEntity.status(200).body(result);
    }

    // 프로필 사진 변경
    @PutMapping("/user/profile/update")
    public ResponseEntity<?> userProfileUpdate(@RequestParam("image") MultipartFile multipartFile) throws IOException {
        Map<String, Object> result = userService.userProfileImage(multipartFile);

        return ResponseEntity.status(200).body(result);
    }

}
