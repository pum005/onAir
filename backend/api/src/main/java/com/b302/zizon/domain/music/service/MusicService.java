package com.b302.zizon.domain.music.service;

import com.b302.zizon.domain.music.dto.*;
import com.b302.zizon.domain.music.dto.request.MusicRecommendRequestDTO;
import com.b302.zizon.domain.music.dto.response.*;
import com.b302.zizon.domain.music.entity.Music;
import com.b302.zizon.domain.music.entity.MyMusicBox;
import com.b302.zizon.domain.music.exception.MusicNotFoundException;
import com.b302.zizon.domain.music.repository.MusicRepository;
import com.b302.zizon.domain.music.repository.MyMusicBoxRepository;
import com.b302.zizon.domain.user.GetUser;
import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.domain.user.repository.UserRepository;
import com.b302.zizon.util.ConvertTime;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.Video;
import com.google.api.services.youtube.model.VideoListResponse;
import com.google.api.services.youtube.model.SearchResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import retrofit2.http.HEAD;

import javax.persistence.EntityNotFoundException;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.net.URLEncoder;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
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

    // 스포티파이 제목 검색 결과 가져오기
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

        query = query.trim();
        log.info(query.toString());

        ResponseEntity<SearchResponseDTO> responseEntity = restTemplate.exchange(
                "https://api.spotify.com/v1/search?q={query}&type=track&limit=50&market=KR&locale=ko-KR",
                HttpMethod.GET,
                requestEntity,
                SearchResponseDTO.class,
                query);
        ResponseEntity<SearchResponseDTO> responseEntityEn = restTemplate.exchange(
                "https://api.spotify.com/v1/search?q={query}&type=track&limit=50&market=KR&",
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

    // 음악 추천
    @Transactional
    public Map<String, Object> recommendMusic(MusicRecommendRequestDTO requestDTO) {

        User user = getUser.getUser();

        String accessToken = getAccessToken();
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        List<SpotifySearchResultDTO> results = new ArrayList<>();

        for (String trackId : requestDTO.getSongId()) {
            ResponseEntity<Track> responseEntity = restTemplate.exchange(
                    "https://api.spotify.com/v1/tracks/{trackId}",
                    HttpMethod.GET,
                    requestEntity,
                    Track.class,
                    trackId);

            Track track = responseEntity.getBody();
            String imageUrl = null;
            List<Image> images = track.getAlbum().getImages();
            if (images != null && !images.isEmpty()) {
                imageUrl = images.get(0).getUrl();
            }

            String musicReleaseDate = track.getAlbum().getRelease_date();

            SpotifySearchResultDTO spotifySearchResultDto = SpotifySearchResultDTO.builder()
                    .musicTitle(track.getName())
                    .musicArtist(track.getArtists().get(0).getName())
                    .musicAlbum(track.getAlbum().getName())
                    .musicImage(imageUrl)
                    .musicReleaseDate(musicReleaseDate)
                    .externalIds(track.getExternal_ids().getIsrc())
                    .spotifyMusicDuration(track.getDuration_ms())
                    .build();

            results.add(spotifySearchResultDto);
        }
        Map<String, Object> response = new HashMap<>();

        int count = 0;

        for (int i = 0; i < 10; i++) {
            log.info(response.toString());
            SpotifySearchResultDTO dto = results.get(i);
            if(count == 3){
                break;
            }
            Map<String, Object> video = findVideo(dto.getMusicTitle(), dto.getMusicArtist(), dto.getSpotifyMusicDuration(), dto.getMusicImage(), dto.getExternalIds());
            if(video.containsKey("musicId")){
                response.put("song"+(count+1), video);
                count++;
            }

        }
        return response;
    }


    // 유튜브 영상 찾기
    @Transactional
    public Map<String, Object> findVideo(String title, String artist, long spotifyMusicDuration, String musicImageUrl, String spotifyId) {
        Map<String, Object> out = new HashMap<>();
        User user = getUser.getUser();

        // 음악 중복체크
        Optional<Music> bySpotifyId = musicRepository.findBySpotifyId(spotifyId);
        if (!bySpotifyId.isEmpty()) {
            Optional<MyMusicBox> byMusicMusicIdAndUserUserId = myMusicBoxRepository.findByMusicMusicIdAndUserUserId(bySpotifyId.get().getMusicId(), user.getUserId());
            // 이미 노래가 보관함에 있으면
            Music music = bySpotifyId.get();
            if (!byMusicMusicIdAndUserUserId.isEmpty()) {
                out.put("message", "이미 보관함에 추가된 노래입니다.");
                out.put("musicId", music.getMusicId());
            } else {
                MyMusicBox build = MyMusicBox.builder()
                        .user(user)
                        .music(bySpotifyId.get()).build();

                myMusicBoxRepository.save(build);
                log.info("노래 추가됨");
                out.put("message", "보관함에 음악 추가 성공");
                out.put("musicId", music.getMusicId());
            }
            return out;
        }

        YoutubeSearchResultDTO result = new YoutubeSearchResultDTO();

        String query = artist + " " + title + " " + "음원";

        YouTube.Search.List searchRequest;
        log.info("검색어 : " + query);
        log.info("음악 시간 : " + spotifyMusicDuration);
        try {
            searchRequest = youtubeApi.search().list(Arrays.asList("id", "snippet"));
            searchRequest.setQ(query);
            searchRequest.setType(Arrays.asList("video"));
            searchRequest.setMaxResults(50L);
            searchRequest.setFields(
                    "items(id(videoId),snippet(publishedAt,channelId,title,description))");

            SearchListResponse searchResponse = searchRequest.execute();

            List<SearchResult> searchResults = searchResponse.getItems();

            long playTimeYoutube = 0L;

            BigInteger maxViews = BigInteger.ZERO;
            int maxResultsToConsider = 50;
            int resultsConsidered = 0;

            for (SearchResult searchResult : searchResults) {
                if (resultsConsidered >= maxResultsToConsider) {
                    break; // 상위 5개만 고려하도록 for 루프 종료
                }

                String videoDescription = searchResult.getSnippet().getDescription().toLowerCase();
                String musicYoutubeId = searchResult.getId().getVideoId();
                String videoTitle = searchResult.getSnippet().getTitle().toLowerCase();

                // "Auto-generated by YouTube." 포함 여부 확인
                if (videoDescription.contains("provided to youtube by iip-dds") ||videoDescription.contains("auto-generated by youtube.")) {
                    log.info("youtube 제공 영상 뽑힘");
                    result.setMusicYoutubeId(searchResult.getId().getVideoId());
                    break; // 해당 비디오를 선택하고 for 루프 종료
                }

                // 커버, 팬메이드 등의 키워드가 제목이나 설명에 포함되면 건너뛴다.
                if (videoTitle.contains("cover") || videoDescription.contains("cover") ||
                        videoTitle.contains("fan-made") || videoDescription.contains("fan-made") ||
                        videoTitle.contains("무대") || videoDescription.contains("무대") ||
                        videoTitle.contains("live") || videoDescription.contains("live") ||
                        videoTitle.contains("performance") || videoDescription.contains("performance") ||
                        videoTitle.contains("MV") || videoDescription.contains("MV") ||
                        videoTitle.contains("practice") || videoDescription.contains("practice")
                ) {
                    log.info("건너뀜" + videoTitle);
                    continue;
                }

                VideoListResponse videoResponse = youtubeApi.videos()
                        .list(Arrays.asList("id", "statistics", "contentDetails"))
                        .setId(Arrays.asList(musicYoutubeId))
                        .execute();

                Video video = videoResponse.getItems().get(0);

                // 재생 시간 검증 (+,- 5초)
                long playTime = convertTime.convertDurationToMillis(
                        video.getContentDetails().getDuration());
                if (Math.abs(spotifyMusicDuration - playTime) > 5000) {
                    continue;
                }
                playTimeYoutube = playTime;

                // 조회수 가장 많은 동영상 1개 리턴
                BigInteger viewCount = video.getStatistics().getViewCount();
                if (viewCount.compareTo(maxViews) > 0
                        && viewCount.compareTo(BigInteger.valueOf(10)) > 0) {
                    maxViews = viewCount;
                    result.setMusicYoutubeId(musicYoutubeId);
                    result.setMusicLength(playTimeYoutube);
                }
                resultsConsidered++; // 고려한 결과 수 증가
            }

            if (result.getMusicYoutubeId() == null) {
                log.info("조건에 맞는 영상이 없음.");
                out.put("code", 204);
                out.put("message", "조건에 맞는 영상을 찾을 수 없습니다.");
                return out;
            }

            Music build = Music.builder()
                    .artist(artist)
                    .duration(playTimeYoutube)
                    .albumCoverUrl(musicImageUrl)
                    .spotifyId(spotifyId)
                    .youtubeVideoId(result.getMusicYoutubeId())
                    .title(title).build();

            Long musicId = 0L;
            // 기존에 음악이 있는지 검사

            Music savedMusic = musicRepository.save(build);

            Optional<MyMusicBox> byMusicMusicId = myMusicBoxRepository.findByMusicMusicId(build.getMusicId());

            if (byMusicMusicId.isEmpty()) {
                MyMusicBox myMusicBox = MyMusicBox.builder()
                        .music(build)
                        .user(user)
                        .build();

                myMusicBoxRepository.save(myMusicBox);
            } else {
                log.info("이미 보관함에 있는 노래");
                out.put("message", "이미 보관함에 추가된 노래입니다.");
                out.put("musicId", savedMusic.getMusicId());
                return out;
            }

            log.info("노래 추가됨");
            out.put("message", "보관함에 음악 추가 성공");
            out.put("musicId", savedMusic.getMusicId());
            return out;

        } catch (Exception e) {
            e.printStackTrace();
            throw new EntityNotFoundException("해당 영상 없음");
        }
    }

    // 해당 음악 상세정보 가져오기
    public MusicInfoResponseDTO musicInfo(Long musicId) {

        User user = getUser.getUser();

        Optional<Music> byMusic = musicRepository.findById(musicId);
        if (byMusic.isEmpty()) {
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
