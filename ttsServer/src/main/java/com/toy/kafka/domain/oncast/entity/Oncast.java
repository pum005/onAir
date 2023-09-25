package com.toy.kafka.domain.oncast.entity;



import com.toy.kafka.domain.music.entity.Music;
import com.toy.kafka.domain.user.entity.User;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "oncast")
@EntityListeners(AuditingEntityListener.class)
@ToString
public class Oncast {

    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "oncast_id")
    private Long oncastId;

    @ToString.Exclude // 이 필드는 toString()에서 제외됩니다.
    @ManyToOne(targetEntity = User.class, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "oncast_create_data_id")
    private OncastCreateData oncastCreateData;

    @Column(name = "created_date")
    @CreatedDate
    private LocalDateTime createTime;

    @Column(name = "share_check")
    private boolean shareCheck;

    @Column(name = "delete_check")
    private boolean deleteCheck;

    @Column(name = "select_check")
    private boolean selectCheck;

    @Column(name = "script_one")
    private String scriptOne;

    @Column(name = "script_two")
    private String scriptTwo;

    @Column(name = "script_three")
    private String scriptThree;

    @Column(name = "script_four")
    private String scriptFour;

    @Column(name = "tts_one")
    private String ttsOne;

    @Column(name = "tts_two")
    private String ttsTwo;

    @Column(name = "tts_three")
    private String ttsThree;

    @Column(name = "tts_four")
    private String ttsFour;

    @JoinColumn(name = "music_id1")
    @ManyToOne(fetch = FetchType.LAZY)
    private Music music1;

    @JoinColumn(name = "music_id2")
    @ManyToOne(fetch = FetchType.LAZY)
    private Music music2;

    @JoinColumn(name = "music_id3")
    @ManyToOne(fetch = FetchType.LAZY)
    private Music music3;

    private int ttsDurationOne;
    private int ttsDurationTwo;
    private int ttsDurationThree;
    private int ttsDurationFour;


    // 공유하기 눌렀을 경우 상태 업데이트
    public void updateShareOncast(){
        this.shareCheck = true;
    }

    // 채택이 됐을 경우 상태 업데이트
    public void updateSeletedOncast(){
        this.selectCheck = true;
    }

    // 삭제 상태로 변경
    public void updateDeleteOncast(){
        this.deleteCheck = true;
    }
}
