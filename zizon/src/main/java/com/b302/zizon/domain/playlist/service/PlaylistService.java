package com.b302.zizon.domain.playlist.service;

import com.b302.zizon.domain.playlist.repository.MyPlaylistMetaRepository;
import com.b302.zizon.domain.playlist.repository.MyPlaylistRepository;
import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    public Long getUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userId = (Long) principal;

        return userId;
    }

    private final UserRepository userRepository;
    private final MyPlaylistRepository myPlaylistRepository;
    private final MyPlaylistMetaRepository myPlaylistMetaRepository;
    
}
