package com.b302.zizon.domain.user.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserDTO {

    private Long userNo;
    private String accountType;
    private String email;
    private String nickname;
    private String profileImage;

    public UserDTO() {
    }
}
