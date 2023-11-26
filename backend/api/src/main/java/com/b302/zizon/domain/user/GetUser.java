package com.b302.zizon.domain.user;

import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.domain.user.exception.UserNotFoundException;
import com.b302.zizon.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class GetUser {

    private final UserRepository userRepository;

    public User getUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(authentication.toString());
        Object principal = authentication.getPrincipal();
        System.out.println(principal.toString());
        Long userId = (Long) principal;

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserNotFoundException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();


        return user;
    }

}
