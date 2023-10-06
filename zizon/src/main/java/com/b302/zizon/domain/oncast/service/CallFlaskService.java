package com.b302.zizon.domain.oncast.service;

import com.b302.zizon.domain.music.entity.Music;
import com.b302.zizon.domain.music.entity.ThemeEnum;
import com.b302.zizon.domain.oncast.dto.response.SongIdsResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CallFlaskService {

    private final RestTemplate restTemplate;

    public SongIdsResponse getMusicData(String story, ThemeEnum theme) {

        // 스토리와 테마를 포함한 요청 본문 생성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("story", story);
        requestBody.put("acousticness", theme.getTheme().getAcousticness());
        requestBody.put("danceability", theme.getTheme().getDanceability());
        requestBody.put("instrumentalness", theme.getTheme().getInstrumentalness());
        requestBody.put("liveness", theme.getTheme().getLiveness());
        requestBody.put("loudness", theme.getTheme().getLoudness());
        requestBody.put("speechiness", theme.getTheme().getSpeechiness());
        requestBody.put("popularity", theme.getTheme().getPopularity());
        requestBody.put("tempo", theme.getTheme().getTempo());

        // 플라스크 서버 엔드포인트
        String flaskEndpoint = "http://52.78.65.222:5000/hadoop/songs";

        // HTTP 요청 보내기
        ResponseEntity<SongIdsResponse> response = restTemplate.postForEntity(flaskEndpoint, requestBody, SongIdsResponse.class);
        
        SongIdsResponse ids =response.getBody();
        log.info("음악 추천 완료");
        for (String s : ids.getSong_ids()){
            log.info("스포티파이 id : " + s);
        }

        return ids;
    }
}