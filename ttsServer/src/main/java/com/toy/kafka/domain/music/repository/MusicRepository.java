package com.toy.kafka.domain.music.repository;

import com.toy.kafka.domain.music.entity.Music;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MusicRepository extends JpaRepository<Music, Long> {

    Optional<Music> findByYoutubeVideoId(String youtubeVideoId);
}
