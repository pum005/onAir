package com.b302.zizon.domain.music.entity;

import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@Getter
@ToString
@EntityListeners(AuditingEntityListener.class)
@Builder
@AllArgsConstructor
public class Music {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long musicId;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false)
    private String artist;
    @Column(nullable = false)
    private int duration;
    @Column(nullable = false)
    private String musicUrl;
    @Column(nullable = false)
    private float acousticness;
    @Column(nullable = false)
    private float danceability;
    @Column(nullable = false)
    private float energy;
    @Column(nullable = false)
    private float instrumentalness;
    @Column(nullable = false)
    private float liveness;
    @Column(nullable = false)
    private float loudness;
    @Column(nullable = false)
    private float speechiness;
    @Column(nullable = false)
    private float tempo;
    @Column(nullable = false)
    private float valence;
    @Column(nullable = false)
    private int popularity;
    @Column(nullable = false)
    private String albumCoverUrl;

    public Music() {
    }
}
