package com.toy.kafka.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserDTO {

    private Long userId;
    private String accountType;
    private String email;
    private String nickname;
    private String profileImage;

    public UserDTO() {
    }
}
