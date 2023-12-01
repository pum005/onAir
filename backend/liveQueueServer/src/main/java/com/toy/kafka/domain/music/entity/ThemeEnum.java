package com.toy.kafka.domain.music.entity;

public enum ThemeEnum {


    //테마 예시임
    //프리셋 수치 바꿔가면서 하면 될듯?
    UPBEAT(Theme.builder().themeName("Upbeat").acousticness(0.8).danceability(0.8).energy(0.8).instrumentalness(0.2).liveness(0.3).loudness(-5.0).speechiness(0.1).tempo(120.0).valence(0.9).popularity(70).build()),

    ENERGETIC(Theme.builder().themeName("Energetic").acousticness(0.7).danceability(0.7).energy(0.9).instrumentalness(0.1).liveness(0.2).loudness(-4.0).speechiness(0.1).tempo(130.0).valence(0.9).popularity(80).build()),

    SAD(Theme.builder().themeName("Sad").acousticness(0.5).danceability(0.4).energy(0.2).instrumentalness(0.8).liveness(0.7).loudness(-10.0).speechiness(0.4).tempo(70.0).valence(0.2).popularity(60).build()),

    MELANCHOLY(Theme.builder().themeName("Melancholy").acousticness(0.6).danceability(0.5).energy(0.3).instrumentalness(0.7).liveness(0.6).loudness(-8.0).speechiness(0.3).tempo(80.0).valence(0.3).popularity(65).build()),

    JOYFUL(Theme.builder().themeName("Joyful").acousticness(0.7).danceability(0.8).energy(0.8).instrumentalness(0.2).liveness(0.2).loudness(-4.0).speechiness(0.1).tempo(120.0).valence(0.8).popularity(70).build()),

    SENSITIVE(Theme.builder().themeName("Sensitive").acousticness(0.7).danceability(0.5).energy(0.3).instrumentalness(0.4).liveness(0.3).loudness(-5.0).speechiness(0.1).tempo(100.0).valence(0.3).popularity(60).build()),

    HOPEFUL(Theme.builder().themeName("Hopeful").acousticness(0.4).danceability(0.6).energy(0.7).instrumentalness(0.2).liveness(0.3).loudness(-5.0).speechiness(0.1).tempo(110.0).valence(0.7).popularity(70).build()),

    CHILL(Theme.builder().themeName("Chill").acousticness(0.7).danceability(0.3).energy(0.2).instrumentalness(0.7).liveness(0.2).loudness(-7.0).speechiness(0.1).tempo(90.0).valence(0.2).popularity(50).build()),

    AGGRESSIVE(Theme.builder().themeName("Aggressive").acousticness(0.2).danceability(0.7).energy(0.9).instrumentalness(0.1).liveness(0.4).loudness(-3.0).speechiness(0.3).tempo(140.0).valence(0.5).popularity(80).build()),

    ROMANTIC(Theme.builder().themeName("Romantic").acousticness(0.6).danceability(0.5).energy(0.4).instrumentalness(0.1).liveness(0.1).loudness(-6.0).speechiness(0.1).tempo(95.0).valence(0.6).popularity(60).build()),

    RETRO(Theme.builder().themeName("Retro").acousticness(0.5).danceability(0.6).energy(0.5).instrumentalness(0.3).liveness(0.3).loudness(-6.0).speechiness(0.1).tempo(100.0).valence(0.5).popularity(65).build()),

    DRAMATIC(Theme.builder().themeName("Dramatic").acousticness(0.3).danceability(0.4).energy(0.6).instrumentalness(0.6).liveness(0.5).loudness(-7.0).speechiness(0.2).tempo(110.0).valence(0.3).popularity(70).build()),

    FUNKY(Theme.builder().themeName("Funky").acousticness(0.3).danceability(0.9).energy(0.7).instrumentalness(0.1).liveness(0.3).loudness(-4.0).speechiness(0.1).tempo(115.0).valence(0.7).popularity(75).build()),

    EXOTIC(Theme.builder().themeName("Exotic").acousticness(0.4).danceability(0.7).energy(0.5).instrumentalness(0.2).liveness(0.2).loudness(-5.0).speechiness(0.2).tempo(105.0).valence(0.4).popularity(60).build()),

    ACOUSTIC(Theme.builder().themeName("Acoustic").acousticness(0.9).danceability(0.3).energy(0.2).instrumentalness(0.8).liveness(0.1).loudness(-8.0).speechiness(0.1).tempo(85.0).valence(0.2).popularity(50).build()),

    NOSTALGIC(Theme.builder().themeName("Nostalgic").acousticness(0.5).danceability(0.4).energy(0.3).instrumentalness(0.5).liveness(0.2).loudness(-7.0).speechiness(0.1).tempo(90.0).valence(0.3).popularity(55).build()),

    DREAMY(Theme.builder().themeName("Dreamy").acousticness(0.7).danceability(0.4).energy(0.3).instrumentalness(0.7).liveness(0.1).loudness(-8.0).speechiness(0.1).tempo(80.0).valence(0.2).popularity(60).build());





    private final Theme theme;

    ThemeEnum(Theme theme) {
        this.theme = theme;
    }

    public Theme getTheme() {
        return theme;
    }
}
