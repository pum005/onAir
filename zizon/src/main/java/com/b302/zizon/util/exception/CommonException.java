package com.b302.zizon.util.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CommonException extends RuntimeException{
    CustomExceptionStatus customExceptionStatus;

}
