package com.b302.zizon.domain.playlist.repository;

import com.b302.zizon.domain.playlist.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    List<Playlist> findByPlaylistMetaPlaylistMetaId(Long PlaylistMetaId);

    Optional<Playlist> findByPlaylistMetaPlaylistMetaIdAndMusicMusicId(Long playlistMetaId, Long musicId);
}
