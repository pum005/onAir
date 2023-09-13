package com.b302.zizon.domain.music.entity;

import com.b302.zizon.domain.user.entity.User;
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
public class MyMusicBox {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long myMusicBoxId;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "music_id")
    private Music music;

    public MyMusicBox() {
    }

}
