package com.b302.zizon.domain.playlist.entity;

import com.b302.zizon.domain.user.entity.User;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@EntityListeners(AuditingEntityListener.class)
@Builder
@AllArgsConstructor
public class MyPlaylistMeta {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long playlistMetaId;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    @Column(nullable = false)
    private String playlistName;
    @Column(nullable = false)
    private LocalDateTime createDate;
    @Column(nullable = false)
    private int playlistCount;

    public MyPlaylistMeta() {
    }

}
