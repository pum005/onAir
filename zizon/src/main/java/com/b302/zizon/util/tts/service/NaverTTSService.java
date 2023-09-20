package com.b302.zizon.util.tts.service;

import com.b302.zizon.util.S3.service.S3UploadService;
import lombok.RequiredArgsConstructor;

import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.tomcat.util.http.fileupload.IOUtils;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.util.Date;
import java.util.UUID;

import org.apache.commons.fileupload.FileItem;


@Service
@RequiredArgsConstructor
public class NaverTTSService {


    private final S3UploadService s3UploadService;
    private static final String CLIENT_ID = "0u1rkuoto7";
    private static final String CLIENT_SECRET = "1PkYCPatyIVR0FVZifbnLrPDL5dknQVCE5svhn0E";
    private static final String API_URL = "https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts";

    public String convertTextToSpeech(String inputtext, String speaker) {
        try {
            String text = URLEncoder.encode(inputtext, "UTF-8");
            String apiURL = "https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts";
            URL url = new URL(apiURL);
            HttpURLConnection con = (HttpURLConnection)url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("X-NCP-APIGW-API-KEY-ID", CLIENT_ID);
            con.setRequestProperty("X-NCP-APIGW-API-KEY", CLIENT_SECRET);
            String postParams = "speaker="+speaker+"&volume=0&speed=0&pitch=0&format=mp3&text=" + text;
            con.setDoOutput(true);
            try (DataOutputStream wr = new DataOutputStream(con.getOutputStream())) {
                wr.writeBytes(postParams);
                wr.flush();
            }
            int responseCode = con.getResponseCode();
            if(responseCode==200) {
                byte[] bytes = new byte[1024];
                String tempname = UUID.randomUUID().toString();
                File f = new File(tempname + ".mp3");
                try (InputStream is = con.getInputStream();
                     OutputStream outputStream = new FileOutputStream(f)) {
                    int read;
                    while ((read = is.read(bytes)) != -1) {
                        outputStream.write(bytes, 0, read);
                    }
                }
                return tempname + ".mp3";
            } else {
                try (BufferedReader br = new BufferedReader(new InputStreamReader(con.getErrorStream()))) {
                    String inputLine;
                    StringBuffer response = new StringBuffer();
                    while ((inputLine = br.readLine()) != null) {
                        response.append(inputLine);
                    }
                    System.out.println(response.toString());
                }
            }
        } catch (Exception e) {
            System.out.println(e);
        }
        return null;
    }

//    public String generateTTS(String text, String speaker) throws IOException {
//
//
//
//        // 일단 볼륨, 스피드, 피치 고정
//        File generatedFile = null;
//        try {
//            String encodedText = URLEncoder.encode(text, "UTF-8");
//            HttpURLConnection con = setupConnection(API_URL);
//
//            // post request
//            String postParams = String.format("speaker=%s&volume=0&speed=0&pitch=0&format=mp3&text=%s", speaker, encodedText);
//            sendPostRequest(con, postParams);
//
//            int responseCode = con.getResponseCode();
//            if(responseCode == 200) { // 정상 호출
//                generatedFile = writeToFile(con.getInputStream());
//            } else {  // 오류 발생
//                printError(con.getErrorStream());
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        System.out.println("ㅎㅇㅋㅋ  "+generatedFile.toString());
//
//        System.out.println("Files.probeContentType(generatedFile.toPath()) : "+generatedFile.toPath());
//        System.out.println("generatedFile.getName() : "+generatedFile.getName());
//        System.out.println("generatedFile.getParentFile() : "+generatedFile.getParentFile());
//
//
//        FileItem fileItem = new DiskFileItem("file", Files.probeContentType(generatedFile.toPath()), false, generatedFile.getName(), (int) generatedFile.length() , generatedFile.getParentFile());
//        System.out.println("file까진 문제없음" + fileItem.toString());
//
//        try {
//
//            InputStream input = new FileInputStream(generatedFile);
//            OutputStream os = fileItem.getOutputStream();
//            IOUtils.copy(input, os);
//
//        }catch (IOException e){
//            System.out.println("IO문제");
//            e.printStackTrace();
//        }
//
//        System.out.println("s3업로드 전 : "+fileItem);
//        MultipartFile  generatedFileConverted = new CommonsMultipartFile(fileItem);
//        System.out.println("s3업로드 전 : "+generatedFileConverted);
//        String savedFileURL= s3UploadService.fileSaveFile(generatedFileConverted);
//        return savedFileURL;
//
//
//    }

    public String generateTTS(String text, String speaker) throws IOException {
        File generatedFile = null;
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

        FileItem fileItem = convertToFileItem(generatedFile);
        MultipartFile  generatedFileConverted = new CommonsMultipartFile(fileItem);
        return s3UploadService.fileSaveFile(generatedFileConverted);
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
