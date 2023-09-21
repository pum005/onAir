package com.b302.zizon.domain.playlist.entity;

import com.b302.zizon.domain.user.entity.User;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@EntityListeners(AuditingEntityListener.class)
@Builder
@AllArgsConstructor
public class PlaylistMeta {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long playlistMetaId;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    @Column(nullable = false)
    private String playlistName;
    @Column(nullable = false)
    @CreatedDate
    private LocalDateTime createDate;
    @Column(nullable = false)
    private int playlistCount;
    @Column(nullable = true)
    private String playlistImage;

    public PlaylistMeta() {
    }

    // 플레이리스트 사진 등록
    public void registPlaylistImage(String imageUrl){
        this.playlistImage = imageUrl;
    }

    // 플레이리스트 개수 +1
    public void plusCountPlaylistCount(){
        this.playlistCount += 1;
    }

    // 플레이리스트 개수 -1
    public void minusCountPlaylistCount(){
        this.playlistCount -= 1;
    }

    // 플레이리스트 사진 null로 변경
    public void changePlaylistImageNull(){
        this.playlistImage = null;
    }
}
