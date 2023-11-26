package com.b302.zizon.domain.music.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Builder;

import javax.persistence.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@Table(name = "theme")
public class Theme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "theme_id")
    private  Long themeId;


    @Column(name = "theme_name")
    private String themeName;

    @Column(name = "acousticness")
    private double acousticness;

    @Column(name = "danceability")
    private double danceability;

    @Column(name = "energy")
    private double energy;

    @Column(name = "instrumentalness")
    private double instrumentalness;

    @Column(name = "liveness")
    private double liveness;

    @Column(name = "loudness")
    private double loudness;

    @Column(name = "speechiness")
    private double speechiness;

    @Column(name = "tempo")
    private double tempo;

    @Column(name = "valence")
    private double valence;

    @Column(name = "popularity")
    private int popularity;

    protected Theme() {}


}
