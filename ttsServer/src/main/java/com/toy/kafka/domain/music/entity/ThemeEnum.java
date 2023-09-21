package com.toy.kafka.domain.music.entity;

public enum ThemeEnum {


    //테마 예시임
    //프리셋 수치 바꿔가면서 하면 될듯?
    UPBEAT(Theme.builder().themeName("Upbeat").acousticness(0.8).danceability(0.8).energy(0.8).instrumentalness(0.2).liveness(0.3).loudness(-5.0).speechiness(0.1).tempo(120.0).valence(0.9).popularity(70).build()),

    ENERGETIC(Theme.builder().themeName("Energetic").acousticness(0.7).danceability(0.7).energy(0.9).instrumentalness(0.1).liveness(0.2).loudness(-4.0).speechiness(0.1).tempo(130.0).valence(0.9).popularity(80).build()),

    SAD(Theme.builder().themeName("Sad").acousticness(0.5).danceability(0.4).energy(0.2).instrumentalness(0.8).liveness(0.7).loudness(-10.0).speechiness(0.4).tempo(70.0).valence(0.2).popularity(60).build()),

    MELANCHOLY(Theme.builder().themeName("Melancholy").acousticness(0.6).danceability(0.5).energy(0.3).instrumentalness(0.7).liveness(0.6).loudness(-8.0).speechiness(0.3).tempo(80.0).valence(0.3).popularity(65).build());


    private final Theme theme;

    ThemeEnum(Theme theme) {
        this.theme = theme;
    }

    public Theme getTheme() {
        return theme;
    }
}
