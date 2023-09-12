package com.b302.zizon.domain.playlist.repository;

import com.b302.zizon.domain.playlist.entity.MyPlaylist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MyPlaylistRepository extends JpaRepository<MyPlaylist, Long> {
}
