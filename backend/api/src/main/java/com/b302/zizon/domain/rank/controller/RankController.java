package com.b302.zizon.domain.rank.controller;

import com.b302.zizon.domain.rank.dto.RankRequestDTO;
import com.b302.zizon.domain.rank.dto.RankResponseDTO;
import com.b302.zizon.domain.rank.service.RankService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class RankController {

    private final RankService rankService;

    // 미니게임 랭크 갱신
    @PostMapping("minigame/rank")
    public ResponseEntity<?> minigameRank(@RequestBody RankRequestDTO requestDTO){
        System.out.println(requestDTO.getRecord() + "시간");
        Map<String, Object> result = rankService.saveRank(requestDTO);

        return ResponseEntity.status(200).body(result);
    }

    //미니게임 기록 가져오기
    @GetMapping("minigame/rank")
    public ResponseEntity<?> minigameRanking(){
        List<RankResponseDTO> ranking = rankService.getRanking();

        return ResponseEntity.status(200).body(ranking);
    }
}

