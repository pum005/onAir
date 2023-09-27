package com.b302.zizon.domain.oncast.service;

import com.b302.zizon.domain.music.entity.Music;
import com.b302.zizon.domain.music.entity.ThemeEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CallFlaskService {

    private final RestTemplate restTemplate;

    public Music[] getMusicData(String story, ThemeEnum theme) {


        // 스토리와 테마를 포함한 요청 본문 생성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("Story", story);
        requestBody.put("Acousticness", theme.getTheme().getAcousticness());
        requestBody.put("Danceability", theme.getTheme().getDanceability());
        requestBody.put("Instrumentalness", theme.getTheme().getInstrumentalness());
        requestBody.put("Liveness", theme.getTheme().getLiveness());
        requestBody.put("Loudness", theme.getTheme().getLoudness());
        requestBody.put("Speechiness", theme.getTheme().getSpeechiness());
        requestBody.put("Popularity", theme.getTheme().getPopularity());


        // 플라스크 서버 엔드포인트
        String flaskEndpoint = "http://your-flask-server-endpoint/musicData";

        // HTTP 요청 보내기
        ResponseEntity<Music[]> response = restTemplate.postForEntity(flaskEndpoint, requestBody, Music[].class);

        Music [] result = response.getBody();

        
        //검색해서 디비에 저장하는 로직

        return result;
    }
}

class MusicData {
    // 음악 데이터 관련 필드들
}
