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
    private String youtubeVideoId;
    @Column(nullable = true)
    private float acousticness;
    @Column(nullable = true)
    private float danceability;
    @Column(nullable = true)
    private float energy;
    @Column(nullable = true)
    private float instrumentalness;
    @Column(nullable = true)
    private float liveness;
    @Column(nullable = true)
    private float loudness;
    @Column(nullable = true)
    private float speechiness;
    @Column(nullable = true)
    private float tempo;
    @Column(nullable = true)
    private float valence;
    @Column(nullable = true)
    private int popularity;
    @Column(nullable = false)
    private String albumCoverUrl;
    @Column(nullable = true, length = 2000)
    private String lylics;

    public Music() {
    }
}
