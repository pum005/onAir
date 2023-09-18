package com.b302.zizon.util.tts.service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Date;


public class NaverTTSService {


    private static final String CLIENT_ID = "0u1rkuoto7";
    private static final String CLIENT_SECRET = "1PkYCPatyIVR0FVZifbnLrPDL5dknQVCE5svhn0E";
    private static final String API_URL = "https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts";

    public File generateTTS(String text, String speaker) {

        // 일단 볼륨, 스피드, 피치 고정
        File generatedFile = null;
        try {
            String encodedText = URLEncoder.encode(text, "UTF-8");
            HttpURLConnection con = setupConnection(API_URL);

            // post request
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
        return generatedFile;
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
        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        wr.writeBytes(postParams);
        wr.flush();
        wr.close();
    }

    private File writeToFile(InputStream is) throws IOException {
        byte[] bytes = new byte[1024];
        int read;
        String tempname = Long.valueOf(new Date().getTime()).toString();
        File f = new File(tempname + ".mp3");
        f.createNewFile();
        try (OutputStream outputStream = new FileOutputStream(f)) {
            while ((read = is.read(bytes)) != -1) {
                outputStream.write(bytes, 0, read);
            }
        }
        return f;
    }

    private void printError(InputStream errorStream) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(errorStream));
        String inputLine;
        StringBuffer response = new StringBuffer();
        while ((inputLine = br.readLine()) != null) {
            response.append(inputLine);
        }
        br.close();
        System.out.println(response.toString());
    }

}
