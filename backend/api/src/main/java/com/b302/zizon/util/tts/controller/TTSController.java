package com.b302.zizon.util.tts.controller;

import com.b302.zizon.util.tts.dto.TextRequest;
import com.b302.zizon.util.tts.service.TTSService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TTSController {

    private final TTSService ttsService;

    @PostMapping("/api/v1/tts")
    public String synthesizeTextToSpeech(@RequestBody TextRequest request) throws Exception {
        ttsService.synthesizeAndSaveMp3(request.getText());
        return "MP3 파일이 생성되었습니다.";
    }
}
