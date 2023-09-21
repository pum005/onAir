package com.toy.kafka.domain.playlist.repository;

import com.toy.kafka.domain.playlist.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    List<Playlist> findByPlaylistMetaPlaylistMetaId(Long PlaylistMeta_id);

    Optional<Playlist> findByPlaylistMetaPlaylistMetaIdAndMusicMusicId(Long playlistMetaId, Long musicId);
}
