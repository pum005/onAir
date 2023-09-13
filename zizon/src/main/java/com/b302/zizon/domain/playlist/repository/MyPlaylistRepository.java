package com.b302.zizon.domain.playlist.repository;

import com.b302.zizon.domain.playlist.entity.MyPlaylist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MyPlaylistRepository extends JpaRepository<MyPlaylist, Long> {

    List<MyPlaylist> findByMyPlaylistMeta(Long myPlaylistMeta_id);

    Optional<MyPlaylist> findByMyPlaylistMetaMyPlaylistMetaIdAndMusicMusicId(Long myPlaylistMetaId, Long musicId);
}
