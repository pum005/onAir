package com.b302.zizon.domain.rank.controller;

import com.b302.zizon.domain.rank.dto.RankRequestDTO;
import com.b302.zizon.domain.rank.service.RankService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class RankController {

    private final RankService rankService;

    // 미니게임 랭크 갱신
    @PostMapping("minigame/rank")
    public ResponseEntity<?> minigameRank(@RequestBody RankRequestDTO requestDTO){
        Map<String, Object> result = rankService.saveRank(requestDTO);

        return ResponseEntity.status(200).body(result);
    }
}

