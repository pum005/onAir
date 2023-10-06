package com.b302.zizon.util.tts.service;

import com.b302.zizon.util.tts.dto.TTSRequest;
import com.b302.zizon.util.tts.dto.TTSRequest.AudioConfig;
import com.b302.zizon.util.tts.dto.TTSRequest.Input;
import com.b302.zizon.util.tts.dto.TTSRequest.Voice;
import com.b302.zizon.util.tts.dto.TTSResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class TTSService {

    private final RestTemplate restTemplate;
    //api key를 application.yml에 넣어두었습니다.
    @Value("${app.api-key.tts}")
    private String apiKey;

    public void synthesizeAndSaveMp3(String text) {
        // 디렉토리 경로 설정
        String directoryPath = "musics";

        // 디렉토리 생성
        File directory = new File(directoryPath);
        if (!directory.exists()) {
            directory.mkdirs(); // 디렉토리 생성
        }

        // 현재 시간을 포맷에 맞게 문자열로 변환
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy년-MM월-dd일-HH시-mm분");
        String currentTime = dateFormat.format(new Date());

        // 파일 이름 설정 (현재 시간을 포함)
        String fileName = currentTime + "-music.mp3";

        // 파일 경로 설정 (디렉토리 경로와 파일 이름 합침)
        String filePath = directoryPath + File.separator + fileName;

        // Google TTS API 요청 URL
        String ttsApiUrl = "https://texttospeech.googleapis.com/v1/text:synthesize?key=" + apiKey;

        // Google TTS API에 요청할 데이터 구성
        TTSRequest ttsRequest = new TTSRequest();
        ttsRequest.setInput(new Input(text));
        ttsRequest.setVoice(new Voice("ko-KR", "ko-KR-Neural2-B", "FEMALE"));
        ttsRequest.setAudioConfig(new AudioConfig("MP3"));

        // HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // HTTP 요청 엔티티 설정
        HttpEntity<TTSRequest> requestEntity = new HttpEntity<>(ttsRequest, headers);

        // Google TTS API 호출 및 응답 받기
        TTSResponse ttsResponse = restTemplate.postForObject(ttsApiUrl, requestEntity, TTSResponse.class);

        // API 응답에서 mp3 바이너리 데이터 가져오기
        String mp3Data = ttsResponse.getAudioContent();

        byte[] decodedData = decodeBase64(mp3Data);
        saveToMusicFile(decodedData, filePath);
    }

    public static byte[] decodeBase64(String base64Data) {
        return Base64.getDecoder().decode(base64Data);
    }

    public static void saveToMusicFile(byte[] data, String fileName) {
        try (FileOutputStream fos = new FileOutputStream(fileName)) {
            fos.write(data);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
