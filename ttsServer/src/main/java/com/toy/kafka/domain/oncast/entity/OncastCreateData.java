package com.toy.kafka.domain.oncast.entity;

import com.toy.kafka.domain.music.entity.ThemeEnum;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Table(name = "oncast_create_data")
public class OncastCreateData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "oncast_create_data_id")
    private Long oncastCreateDateId;

    @Column(nullable = false)
    private String title;

    @Column(name = "theme")
    @Enumerated(EnumType.STRING)
    private ThemeEnum theme;

    @Column(name = "story")
    private String story;

    @Column(nullable = false)
    private String djName;

}
