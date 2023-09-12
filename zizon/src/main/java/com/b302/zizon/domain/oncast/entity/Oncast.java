package com.b302.zizon.domain.oncast.entity;


import com.b302.zizon.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "oncast")
public class Oncast {

    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "oncast_id")
    private Long oncastId;

    @ManyToOne(targetEntity = User.class, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "created_date")
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

    @Column(name = "oncast_music_one")
    private String oncastMusicOne;

    @Column(name = "oncast_music_two")
    private String oncastMusicTwo;

    @Column(name = "oncast_music_three")
    private String oncastMusicThree;


}
