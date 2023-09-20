package com.b302.zizon.domain.oncast.controller;

import com.b302.zizon.domain.oncast.dto.request.OncastRequestDto;
import com.b302.zizon.domain.oncast.dto.response.OncastResponseDto;
import com.b302.zizon.domain.oncast.entity.Oncast;
import com.b302.zizon.domain.oncast.service.OncastService;
import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class OncastController {


    private final OncastService oncastService;

    @Transactional
    @PostMapping("/oncast/create")
    public ResponseEntity<?> registOncast(@RequestBody OncastRequestDto request) {

        System.out.println("start -> "+request.toString());
        Oncast oncast = oncastService.saveOncast(request);

        System.out.println("Controller = "+oncast.toString());

        return ResponseEntity.status(200).body("Oncast 생성 성공!");



    }

    // oncast 정보 가져오기
    @GetMapping("oncast")
    public ResponseEntity<?> getOncast(){
        Map<String, Object> oncast = oncastService.getOncast();

        return ResponseEntity.status(HttpStatus.OK).body(oncast);
    }

    // oncast 공유하기
    @PatchMapping("oncast/shares/{oncast_id}")
    public ResponseEntity<?> shareOncast(@PathVariable Long oncast_id){
        oncastService.shareOncast(oncast_id);

        return ResponseEntity.status(HttpStatus.OK).body("공유하기 성공");
    }

    // oncast 삭제하기
    @PatchMapping("oncast/{oncast_id}")
    public ResponseEntity<?> deleteOncast(@PathVariable Long oncast_id){
        oncastService.deleteOncast(oncast_id);

        return ResponseEntity.status(HttpStatus.OK).body("온캐스트 삭제 성공");
    }

    // oncast 재생하기
    @GetMapping("oncast/play/{oncast_id}")
    public ResponseEntity<?> playOncast(@PathVariable Long oncast_id){
        Map<String, Object> result = oncastService.playOncast(oncast_id);

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

}
