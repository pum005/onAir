package com.b302.zizon.domain.oncast.entity;

import com.b302.zizon.domain.music.entity.ThemeEnum;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Table(name = "oncast_create_date")
public class OncastCreateData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "oncast_create_data_id")
    private Long oncastCreateDateId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "oncast_id")
    private Oncast oncast;

    @Column(name = "theme")
    private ThemeEnum theme;

    @Column(name = "story")
    private String story;

    @Column(name = "request_music_one")
    private String requestMusicOne;

    @Column(name = "request_music_two")
    private String requestMusicTwo;

    @Column(name = "request_music_three")
    private String requestMusicThree;



}
