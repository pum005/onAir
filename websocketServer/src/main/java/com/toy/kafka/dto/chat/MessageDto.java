package com.toy.kafka.dto.chat;

import lombok.Data;
@Data
public class MessageDto {

    private long senderSeq; //userSeq

    private String sender; // 보낸사람

    private long badgeSeq; // 1 2 3 / 욕설일 때: 0

    private String content; // 텍스트 내용

    private boolean isBan; // Ban 여부
}
