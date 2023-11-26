package com.b302.zizon.util.tts.service;

import com.b302.zizon.util.S3.service.S3UploadService;
import com.mpatric.mp3agic.Mp3File;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.tomcat.util.http.fileupload.IOUtils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.fileupload.FileItem;


@Service
@RequiredArgsConstructor
@Slf4j
public class NaverTTSService {


    private final S3UploadService s3UploadService;
    @Value("${tts.client-id}")
    private String CLIENT_ID;
    @Value("${tts.client-secret}")
    private String CLIENT_SECRET;
    private static final String API_URL = "https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts";



    public Map<String, Object> generateTTS(String text, String speaker) throws IOException {
        File generatedFile = null;
        Map<String, Object> result = new HashMap<>();
        try {
            String encodedText = URLEncoder.encode(text, "UTF-8");
            HttpURLConnection con = setupConnection(API_URL);
            String postParams = String.format("speaker=%s&volume=0&speed=0&pitch=0&format=mp3&text=%s", speaker, encodedText);
            sendPostRequest(con, postParams);

            int responseCode = con.getResponseCode();

            if(responseCode == 200) { // 정상 호출
                generatedFile = writeToFile(con.getInputStream());
            } else {  // 오류 발생
                printError(con.getErrorStream());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        
        // 시간을 받는 메서드
        int durationInSeconds = getDurationOfMp3(generatedFile);
        // 출력
        log.info("tts 시간 출력 : " + durationInSeconds);

        FileItem fileItem = convertToFileItem(generatedFile);
        MultipartFile generatedFileConverted = new CommonsMultipartFile(fileItem);
        String s3Url = s3UploadService.fileSaveFile(generatedFileConverted);



        if (generatedFile != null && generatedFile.exists()) {
            generatedFile.delete();
        }

        result.put("tts", s3Url);
        result.put("time", durationInSeconds);

        return result;
    }

//    private int getDurationOfMp3(File mp3File) {
//        try {
//            AudioFile audioFile = AudioFileIO.read(mp3File);
//            return audioFile.getAudioHeader().getTrackLength();
//        } catch (Exception e) {
//            e.printStackTrace();
//            return -1; // 혹은 적절한 오류 처리를 해주세요
//        }
//    }

    private int getDurationOfMp3(File mp3File) {
        try {
            Mp3File mp3 = new Mp3File(mp3File);
            long durationInMilliseconds = mp3.getLengthInMilliseconds();
            return (int) durationInMilliseconds;
        } catch (Exception e) {
            e.printStackTrace();
            return -1; // 혹은 적절한 오류 처리를 해주세요
        }
    }


    private HttpURLConnection setupConnection(String apiURL) throws IOException {
        URL url = new URL(apiURL);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("X-NCP-APIGW-API-KEY-ID", CLIENT_ID);
        con.setRequestProperty("X-NCP-APIGW-API-KEY", CLIENT_SECRET);
        return con;
    }

    private void sendPostRequest(HttpURLConnection con, String postParams) throws IOException {
        con.setDoOutput(true);
        try(DataOutputStream wr = new DataOutputStream(con.getOutputStream())) {
            wr.writeBytes(postParams);
            wr.flush();
            wr.close();
        }

    }

    private File writeToFile(InputStream is) throws IOException {
        byte[] buffer = new byte[1024];
        String tempname = UUID.randomUUID().toString();
        File tempFile = new File(tempname + ".mp3");

        try(OutputStream outputStream = new FileOutputStream(tempFile)) {
            int bytesRead;
            while((bytesRead = is.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
        }
        return tempFile;
    }

    private void printError(InputStream errorStream) throws IOException {
        try(BufferedReader br = new BufferedReader(new InputStreamReader(errorStream))) {
            String line;
            while((line = br.readLine()) != null) {
                System.err.println(line);
            }
        }
    }

    private FileItem convertToFileItem(File generatedFile) throws IOException {
        FileItem fileItem = new DiskFileItem("file", Files.probeContentType(generatedFile.toPath()), false, generatedFile.getName(), (int) generatedFile.length() , generatedFile.getParentFile());
        try(InputStream input = new FileInputStream(generatedFile);
            OutputStream os = fileItem.getOutputStream()) {
            IOUtils.copy(input, os);
        }
        return fileItem;
    }

}
