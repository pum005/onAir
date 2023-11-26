package com.b302.zizon.util.tts.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TTSRequest {
    private Input input;
    private Voice voice;
    private AudioConfig audioConfig;

    @Data
    @AllArgsConstructor
    public static class Input {
        private String text;
    }

    @Data
    @AllArgsConstructor
    public static class Voice {
        private String languageCode;
        private String name;
        private String ssmlGender;
    }

    @Data
    @AllArgsConstructor
    public static class AudioConfig {
        private String audioEncoding;
    }
}