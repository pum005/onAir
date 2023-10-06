package com.b302.zizon.util.S3.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3UploadService {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String profileSaveFile(MultipartFile multipartFile) throws IOException {
        String originalFilename = multipartFile.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")); // 파일 확장자

        // 사진 확장자가 맞지 않으면
        if (!isValidExtensionImage(extension)) {
            throw new IllegalArgumentException("사진 확장자가 아닙니다.");
        }

        String randomName = UUID.randomUUID().toString(); // 랜덤한 문자열 생성
        String newFilename = "user_profile/" + randomName + extension; // 랜덤한 문자열과 확장자를 합쳐서 새 파일명 생성

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getSize());
        metadata.setContentType(multipartFile.getContentType());

        amazonS3.putObject(bucket, newFilename, multipartFile.getInputStream(), metadata);
        return amazonS3.getUrl(bucket, newFilename).toString();
    }


    public String fileSaveFile(MultipartFile multipartFile) throws IOException {
        String originalFilename = multipartFile.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")); // 파일 확장자

        // 파일 확장자가 맞지 않으면
        if (!isValidExtensionFile(extension)) {
//            throw new CommonException(CustomExceptionStatus.EXTENSION_ERROR_FILE);
        }

        LocalDateTime current = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");
        String formatted = current.format(formatter);


        String newFilename = "oncast/tts/" + formatted + multipartFile.getOriginalFilename(); // 랜덤한 문자열과 확장자를 합쳐서 새 파일
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getSize());
        metadata.setContentType(multipartFile.getContentType());

        amazonS3.putObject(bucket, newFilename, multipartFile.getInputStream(), metadata);
        return amazonS3.getUrl(bucket, newFilename).toString();
    }

    // 사진 확장자 검사
    private boolean isValidExtensionImage(String extension) {
        String[] allowedExtensions = {".jpg", ".jpeg", ".png"};
        for (String allowedExtension : allowedExtensions) {
            if (allowedExtension.equalsIgnoreCase(extension)) {
                return true;
            }
        }
        return false;
    }

    // 파일 확장자 검사
    private boolean isValidExtensionFile(String extension) {
        String[] allowedExtensions = {
                ".mp3", ".wav", ".ogg", ".m4a",    // 오디오 확장자
                ".mp4", ".avi", ".mkv", ".mov", ".flv", ".wmv"   // 비디오 확장자
        };
        for (String allowedExtension : allowedExtensions) {
            if (allowedExtension.equalsIgnoreCase(extension)) {
                return true;
            }
        }
        return false;
    }

//    public String saveFileBase64(byte[] data, String filename) throws IOException {
//        ObjectMetadata metadata = new ObjectMetadata();
//        metadata.setContentLength(data.length);
//
//        String extension = filename.substring(filename.lastIndexOf(".")).toLowerCase(); // 파일 확장자
//        String contentType = "image/jpeg";
//        if (".png".equals(extension)) {
//            contentType = "image/png";
//        }
//        metadata.setContentType(contentType);
//
//        // ByteArrayInputStream을 사용하여 byte[]를 InputStream으로 변환
//        ByteArrayInputStream inputStream = new ByteArrayInputStream(data);
//
//        String randomName = UUID.randomUUID().toString(); // 랜덤한 문자열 생성
//        String newFilename = randomName + extension; // 랜덤한 문자열과 확장자를 합쳐서 새 파일명 생성
//
//        amazonS3.putObject(bucket, newFilename, inputStream, metadata);
//        return amazonS3.getUrl(bucket, newFilename).toString();
//    }
}