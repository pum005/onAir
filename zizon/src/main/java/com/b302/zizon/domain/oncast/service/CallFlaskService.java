package com.b302.zizon.domain.oncast.service;

import com.b302.zizon.domain.music.entity.Music;
import com.b302.zizon.domain.music.entity.ThemeEnum;
import com.b302.zizon.domain.oncast.dto.response.SongIdsResponse;
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
        String flaskEndpoint = "http://13.125.211.179:5000/songs";

        // HTTP 요청 보내기
        ResponseEntity<SongIdsResponse> response = restTemplate.postForEntity(flaskEndpoint, requestBody, SongIdsResponse.class);
//        for(String s : response.getBody()){
//            System.out.println(s);
//        }


        SongIdsResponse ids =response.getBody();
        System.out.println("음악추천 완료");
        System.out.println(ids);
        for (String s : ids.getSong_ids()){
            System.out.println(s);
        }
        System.out.println("여기까지");

        //검색해서 디비에 저장하는 로직

        return ids;
    }
}

class MusicData {
    // 음악 데이터 관련 필드들
}