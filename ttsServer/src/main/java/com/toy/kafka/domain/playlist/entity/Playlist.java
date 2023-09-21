package com.toy.kafka.domain.playlist.entity;

import com.toy.kafka.domain.music.entity.Music;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@Getter
@ToString
@EntityListeners(AuditingEntityListener.class)
@Builder
@AllArgsConstructor
public class Playlist {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long playlistId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "playlist_meta_id")
    private PlaylistMeta playlistMeta;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "music_id")
    private Music music;


    public Playlist() {
    }
}
