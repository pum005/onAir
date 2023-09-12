package com.b302.zizon.domain.playlist.repository;

import com.b302.zizon.domain.playlist.entity.MyPlaylistMeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MyPlaylistMetaRepository extends JpaRepository<MyPlaylistMeta, Long> {

    List<MyPlaylistMeta> findByUserUserId(Long id);
}
