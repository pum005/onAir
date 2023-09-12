package com.b302.zizon.util.gpt.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
//Front단에서 요청하는 DTO
public class QuestionRequest implements Serializable {
    private String question;

}
