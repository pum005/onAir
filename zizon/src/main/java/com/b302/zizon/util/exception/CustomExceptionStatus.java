package com.b302.zizon.util.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CustomExceptionStatus {

    /*
       CODE : 카테고리 (4자리 정수)
       MESSAFE : 메세지
     */

    NOT_FOUND_REFRESHTOKEN(-1001, "리프레시 토큰이 없습니다."),
    NOT_MATCH_REFRESHTOKEN(-1002, "리프레시 토큰이 일치하지 않습니다.");


    private final int code;
    private final String message;


}
