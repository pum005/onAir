package com.b302.zizon.util.security.dto;

import com.b302.zizon.domain.user.enums.AuthProvider;
import lombok.Getter;

@Getter
public class SignUpRequest {
    private String id;
    private String email;
    private String nickname;
    private String profileImageUrl;
    private AuthProvider authProvider;
}
