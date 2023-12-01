package com.toy.kafka.domain.music.repository;

import com.toy.kafka.domain.music.entity.MyMusicBox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MyMusicBoxRepository extends JpaRepository<MyMusicBox, Long> {

    List<MyMusicBox> findByUserUserId(Long userId);

    Optional<MyMusicBox> findByMusicMusicIdAndUserUserId(Long musicId, Long userId);

    Optional<MyMusicBox> findByMusicMusicId(Long musicId);


}
