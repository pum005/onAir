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
import retrofit2.http.GET;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class OncastController {

    private final OncastService oncastService;

    @PostMapping("/oncast/create")
    public ResponseEntity<?> registOncast(@RequestBody OncastRequestDto request) {

        Oncast oncast = oncastService.saveOncast(request);

        return ResponseEntity.status(200).body(oncast.getOncastId());
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
        Map<String, Object> result = oncastService.shareOncast(oncast_id);

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    // oncast 삭제하기
    @PatchMapping("oncast/{oncast_id}")
    public ResponseEntity<?> deleteOncast(@PathVariable Long oncast_id){
        Map<String, Object> result = oncastService.deleteOncast(oncast_id);

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    // oncast 재생하기
    @GetMapping("oncast/play/{oncast_id}")
    public ResponseEntity<?> playOncast(@PathVariable Long oncast_id){
        Map<String, Object> result = oncastService.playOncast(oncast_id);

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    // Livq Queue 가져오기
    @GetMapping("oncast/livelist")
    public ResponseEntity<?> getLiveQueueList(){
        Map<String, Object> result = oncastService.getLiveQueueList();

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    // 라이브 서버 상태 가져오기
    @GetMapping("oncast/live-server")
    public ResponseEntity<?> getLiveServerStatus(){
        Map<String, Object> result = oncastService.getLiveServerStatus();

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

}
