package com.b302.zizon.domain.music.service;

import com.b302.zizon.domain.music.dto.*;
import com.b302.zizon.domain.music.dto.response.*;
import com.b302.zizon.domain.music.entity.Music;
import com.b302.zizon.domain.music.entity.MyMusicBox;
import com.b302.zizon.domain.music.exception.MusicNotFoundException;
import com.b302.zizon.domain.music.repository.MusicRepository;
import com.b302.zizon.domain.music.repository.MyMusicBoxRepository;
import com.b302.zizon.domain.user.GetUser;
import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.domain.user.exception.UserNotFoundException;
import com.b302.zizon.domain.user.repository.UserRepository;
import com.b302.zizon.util.ConvertTime;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.Video;
import com.google.api.services.youtube.model.VideoListResponse;
import com.google.api.services.youtube.model.SearchResult;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.persistence.EntityNotFoundException;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.net.URLEncoder;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MusicService {

    @Value("${spotify.client.id}")
    private String clientId;

    @Value("${spotify.client.secret}")
    private String clientSecret;

    private final YouTube youtubeApi;
    private final ConvertTime convertTime;
    private final MusicRepository musicRepository;
    private final MyMusicBoxRepository myMusicBoxRepository;
    private final UserRepository userRepository;
    private final GetUser getUser;



    // 스포티파이 액세스 가져오기
    private String getAccessToken() {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(clientId, clientSecret);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "client_credentials");

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<AccessTokenResponse> responseEntity = restTemplate.exchange(
                "https://accounts.spotify.com/api/token",
                HttpMethod.POST,
                requestEntity,
                AccessTokenResponse.class);

        return responseEntity.getBody().getAccess_token();
    }

    // 스포티파이 검색 결과 가져오기
    public List<SpotifySearchResultDTO> searchSpotifyMusicList(String query) {

        User user = getUser.getUser();

        String accessToken = getAccessToken();
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        String encodedQuery;
        try {
            encodedQuery = URLEncoder.encode(query, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to encode the query string.", e);
        }

        ResponseEntity<SearchResponseDTO> responseEntity = restTemplate.exchange(
                "https://api.spotify.com/v1/search?q={query}&type=track&limit=10&market=KR&locale=ko-KR",
                HttpMethod.GET,
                requestEntity,
                SearchResponseDTO.class,
                query);
        ResponseEntity<SearchResponseDTO> responseEntityEn = restTemplate.exchange(
                "https://api.spotify.com/v1/search?q={query}&type=track&limit=10&market=KR&",
                HttpMethod.GET,
                requestEntity,
                SearchResponseDTO.class,
                query);

        List<SpotifySearchResultDTO> results = new ArrayList<>();
        int resultSize = responseEntity.getBody().getTracks().getItems().size();
        for (int i = 0; i < resultSize; i++) {
//    for (Track track : responseEntity.getBody().getTracks().getItems()) {
            Track track = responseEntity.getBody().getTracks().getItems().get(i);
            Track trackEn = responseEntityEn.getBody().getTracks().getItems().get(i);
            String imageUrl = null;
            List<Image> images = track.getAlbum().getImages();
            if (images != null && !images.isEmpty()) {
                imageUrl = images.get(0).getUrl();
            }

            String musicReleaseDate = track.getAlbum().getRelease_date();

            SpotifySearchResultDTO spotifySearchResultDto = SpotifySearchResultDTO.builder()
                    .musicTitle(track.getName())
                    .musicTitleEn(trackEn.getName())
                    .musicArtist(track.getArtists().get(0).getName()) // Use get() to access the first artist
                    .musicArtistEn(trackEn.getArtists().get(0).getName())
                    .musicAlbum(track.getAlbum().getName())
                    .musicImage(imageUrl)
                    .musicReleaseDate(musicReleaseDate)
                    .externalIds(track.getExternal_ids().getIsrc())
                    .spotifyMusicDuration(track.getDuration_ms())
                    .build();

            results.add(spotifySearchResultDto);
        }

        return results;
    }

    // 유튜브 영상 찾기
    public YoutubeSearchResultDTO findVideo(String title, String artist, long spotifyMusicDuration, String musicImageUrl) {
        User user = getUser.getUser();

        YoutubeSearchResultDTO result = new YoutubeSearchResultDTO();

        String query = title + " " + artist;
        YouTube.Search.List searchRequest;
        try {
            searchRequest = youtubeApi.search().list(Arrays.asList("id", "snippet"));
            searchRequest.setQ(query);
            searchRequest.setType(Arrays.asList("video"));
            searchRequest.setMaxResults(20L);
            searchRequest.setFields(
                    "items(id(videoId),snippet(publishedAt,channelId,title,description))");

            SearchListResponse searchResponse = searchRequest.execute();
            List<SearchResult> searchResults = searchResponse.getItems();
            long playTimeYoutube = 0L;

            BigInteger maxViews = BigInteger.ZERO;

            for (SearchResult searchResult : searchResults) {
                String musicYoutubeId = searchResult.getId().getVideoId();
                VideoListResponse videoResponse = youtubeApi.videos()
                        .list(Arrays.asList("id", "statistics", "contentDetails"))
                        .setId(Arrays.asList(musicYoutubeId))
                        .execute();

                Video video = videoResponse.getItems().get(0);

                // 재생 시간 검증 (+,- 3초)
                long playTime = convertTime.convertDurationToMillis(
                        video.getContentDetails().getDuration());
                if (Math.abs(spotifyMusicDuration - playTime) > 5000) {
                    continue;
                }
                playTimeYoutube = playTime;

                // 조회수 가장 많은 동영상 1개 리턴
                BigInteger viewCount = video.getStatistics().getViewCount();
                if (viewCount.compareTo(maxViews) > 0
                        && viewCount.compareTo(BigInteger.valueOf(100000)) > 0) {
                    maxViews = viewCount;
                    result.setMusicYoutubeId(musicYoutubeId);
                    result.setMusicLength(playTimeYoutube);
                }
            }

            System.out.println(playTimeYoutube);

            Music build = Music.builder()
                    .artist(artist)
                    .duration(playTimeYoutube)
                    .albumCoverUrl(musicImageUrl)
                    .youtubeVideoId(result.getMusicYoutubeId())
                    .title(title).build();

            Long musicId = 0L;
            // 기존에 음악이 있는지 검사
            Optional<Music> byYoutubeVideoId = musicRepository.findByYoutubeVideoId(result.getMusicYoutubeId());

            Music music = null;

            // 기존에 음악이 없으면
            if(byYoutubeVideoId.isEmpty()){
                // 음악 저장
                music = musicRepository.save(build);
                musicId = music.getMusicId();
            }
            if(byYoutubeVideoId.isPresent()){
                music = byYoutubeVideoId.get();
            }

            musicId = music.getMusicId();

            Optional<MyMusicBox> byMusicMusicId = myMusicBoxRepository.findByMusicMusicId(musicId);

            MyMusicBox myMusicBox = MyMusicBox.builder()
                    .music(music)
                    .user(user)
                    .build();

            if(byMusicMusicId.isEmpty()){
                MyMusicBox save = myMusicBoxRepository.save(myMusicBox);
            }

            return result;
        } catch (Exception e) {
            throw new EntityNotFoundException("해당 영상 없음");
        }
    }
    
    // 해당 음악 상세정보 가져오기
    public MusicInfoResponseDTO musicInfo(Long musicId){

        User user = getUser.getUser();

        Optional<Music> byMusic = musicRepository.findById(musicId);
        if(byMusic.isEmpty()){
            throw new MusicNotFoundException("해당 음악의 정보가 없습니다.");
        }

        Music music = byMusic.get();

        MusicInfoResponseDTO build = MusicInfoResponseDTO.builder()
                .musicId(musicId)
                .title(music.getTitle())
                .artist(music.getArtist())
                .duration(music.getDuration())
                .youtubeVideoId(music.getYoutubeVideoId())
                .albumCoverUrl(music.getAlbumCoverUrl()).build();

        return build;
    }

//    // 크롤링
//    private String getLyricsFromMelon(String title, String artist) throws InterruptedException {
//        System.setProperty("webdriver.chrome.driver", "C:\\Users\\SSAFY\\Desktop\\chromedriver-win32\\chromedriver.exe");
//
//        ChromeOptions options = new ChromeOptions();
//        options.addArguments("--headless");
//        options.addArguments("--disable-popup-blocking");
//        options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36");
//
//
//        WebDriver driver = new ChromeDriver(options);
//        driver.get("https://www.melon.com/");
//
//        // 검색창에 노래 제목 입력
//        driver.findElement(By.id("top_search")).sendKeys(title + " " + artist);
//
//        // 검색 버튼 클릭
//        driver.findElement(By.className("btn_icon.search_m")).click();
//
//        // TODO: 검색 결과에서 해당 노래를 찾아 클릭.
//        driver.findElement(By.xpath("//a[@title='곡정보 보기' and contains(., '" + title + "')]")).click();
//
//        // 가사 가져오기
//        WebElement lyricsElement = driver.findElement(By.className("lyric"));
//        String lyrics = lyricsElement.getText();
//        System.out.println(lyrics);
//
//        driver.quit();
//
//        return lyrics;
//    }
}
