package com.b302.zizon.domain.user.service;

import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.domain.user.entity.UserRepository;
import com.b302.zizon.domain.user.enums.Role;
import com.b302.zizon.exception.BadRequestException;
import com.b302.zizon.util.security.dto.SignUpRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public String createUser(SignUpRequest signUpRequest){
        if(userRepository.existsByIdAndAuthProvider(signUpRequest.getId(), signUpRequest.getAuthProvider())){
            throw new BadRequestException("aleady exist user");
        }

        return userRepository.save(
                User.builder()
                        .id(signUpRequest.getId())
                        .nickname(signUpRequest.getNickname())
                        .email(signUpRequest.getEmail())
                        .profileImageUrl(signUpRequest.getProfileImageUrl())
                        .role(Role.USER)
                        .authProvider(signUpRequest.getAuthProvider())
                        .build()).getId();
    }
}
