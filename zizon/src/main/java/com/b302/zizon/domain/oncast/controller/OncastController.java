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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class OncastController {


    private final OncastService oncastService;

    @Transactional
    @PostMapping("/oncast/create")
    public ResponseEntity<?> registOncast(@RequestBody OncastRequestDto request) {


        // request를 가지고 음악 추천받는 로직 - 테마 + 사연(감성 분석 후)

        String[] oncastMusic = new String[3];


        Oncast oncast = oncastService.saveOncast(request,oncastMusic);

//        Map<String, Object> result;

//        return ResponseEntity.status(200).body();


        return new ResponseEntity<>(OncastResponseDto.builder()
                .oncastId(oncast.getOncastId())
                .userId(oncast.getUser().getUserId())
                .createTime(oncast.getCreateTime())
                .shareCheck(oncast.isShareCheck())
                .deleteCheck(oncast.isDeleteCheck())
                .selectCheck(oncast.isSelectCheck())
                .scriptOne(oncast.getScriptOne())
                .scriptTwo(oncast.getScriptTwo())
                .scriptThree(oncast.getScriptThree())
                .scriptFour(oncast.getScriptFour())
                .ttsOne(oncast.getTtsOne())
                .ttsTwo(oncast.getTtsTwo())
                .ttsThree(oncast.getTtsThree())
                .ttsFour(oncast.getTtsFour())
                .oncastMusicOne(oncast.getOncastMusicOne())
                .oncastMusicTwo(oncast.getOncastMusicTwo())
                .oncastMusicThree(oncast.getOncastMusicThree())
                .build(), HttpStatus.CREATED);

    }

}
