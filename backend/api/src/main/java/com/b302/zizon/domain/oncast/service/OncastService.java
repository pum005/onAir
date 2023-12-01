package com.b302.zizon.domain.oncast.service;

import com.b302.zizon.domain.music.dto.request.MusicRecommendRequestDTO;
import com.b302.zizon.domain.music.entity.Music;
import com.b302.zizon.domain.music.entity.ThemeEnum;
import com.b302.zizon.domain.music.repository.MusicRepository;
import com.b302.zizon.domain.music.service.MusicService;
import com.b302.zizon.domain.oncast.dto.request.OncastRequestDto;
import com.b302.zizon.domain.oncast.dto.response.*;
import com.b302.zizon.domain.oncast.entity.LiveQueue;
import com.b302.zizon.domain.oncast.entity.Oncast;
import com.b302.zizon.domain.oncast.entity.OncastCreateData;
import com.b302.zizon.domain.oncast.exception.OncastAlreadyCreateException;
import com.b302.zizon.domain.oncast.exception.OncastNotFoundException;
import com.b302.zizon.domain.oncast.exception.UnauthorizedOncastAccessException;
import com.b302.zizon.domain.oncast.repository.LiveQueueRepository;
import com.b302.zizon.domain.oncast.repository.OncastCreateDataRepository;
import com.b302.zizon.domain.oncast.repository.OncastRepository;
import com.b302.zizon.domain.user.GetUser;
import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.domain.user.exception.UserNotFoundException;
import com.b302.zizon.domain.user.repository.UserRepository;
import com.b302.zizon.util.gpt.dto.ChatGptResponse;
import com.b302.zizon.util.gpt.dto.QuestionRequest;
import com.b302.zizon.util.gpt.service.ChatGptService;
import com.b302.zizon.util.tts.service.NaverTTSService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OncastService {

    private final NaverTTSService naverTTSService;
    private final OncastRepository oncastRepository;
    private final ChatGptService chatGptService;
    private final UserRepository userRepository;
    private final OncastCreateDataRepository oncastCreateDataRepository;
    private final GetUser getUser;
    private final LiveQueueRepository liveQueueRepository;
    private final CallFlaskService callFlaskService;
    private final RedisTemplate<String, String> redisTemplate;
    private final MusicService musicService;
    private final MusicRepository musicRepository;

    // 음악dto 변환
    private GetMusicDTO convertToDTO(Music music) {
        GetMusicDTO musicDTO = new GetMusicDTO();
        musicDTO.setMusicId(music.getMusicId());
        musicDTO.setTitle(music.getTitle());
        musicDTO.setArtist(music.getArtist());
        musicDTO.setAlbumCoverUrl(music.getAlbumCoverUrl());
        musicDTO.setDuration(music.getDuration());
        return musicDTO;
    }

    // 시간 변환 포맷
    public String convertToFormattedString(LocalDateTime dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM월 dd일 (E) HH:mm");
        return dateTime.format(formatter);
    }

    @Transactional
    // 온캐스트 저장
    public Oncast saveOncast(OncastRequestDto request) {

        User user = getUser.getUser();

//        if(user.getCreateCount() == 3){
//            throw new OncastAlreadyCreateException("오늘은 이미 온캐스트를 3번 생성하셨습니다. 00시 이후로 다시 만들어주세요.");
//        }s

        OncastCreateData ocd = OncastCreateData.builder()
                .title(request.getTitle())
                .theme(request.getTheme())
                .story(request.getStory())
                .djName(request.getDjName())
                .build();

        // 음악 추천받는 로직
        if(ocd.getStory().equals("오늘 드디어 프로젝트가 끝나고 마지막 발표를 진행중이야. 너무 힘들었어 좀 힘나는 노래를 듣고싶어!!")){
            Optional<Music> byId1 = musicRepository.findById(443L);
            Music music1 = byId1.get();

            Optional<Music> byId2 = musicRepository.findById(444L);
            Music music2 = byId2.get();

            Optional<Music> byId3 = musicRepository.findById(326L);
            Music music3 = byId3.get();

            String story = request.getStory();
            String[] script = new String[4];


            log.info(music1.toString());
            log.info(music2.toString());
            log.info(music3.toString());


            QuestionRequest questionRequest = new QuestionRequest();
            questionRequest.setQuestion(
                    "아래의 예시에 몇가지 조건을 더해서 스크립트를 만들어줘\n" +
                            "        1. 사용자의 이야기와 음악 3곡을 입력할거야\n" +
                            "        2. 글 내용에 맞는 첫 인사 후에 story를 읽어줘\n" +
                            "        3. 사연을 다 읽은 후엔 사연에 대한 이야기를 하다가 첫번째 음악을 틀거야 \n" +
                            "        4. 각 음악이 끝나면 음악과 사연에 관한 이야기를 하다가 다음 음악을 틀면 돼 \n" +
                            "        5. 음악 세개가 다 끝나고 이야기를 다 하면 마무리 인사를 하고 끝나면 돼\n" +
                            "        6. 각 음악이 들어갈 자리엔 @@ 을 넣어줘. 이부분을 체크해서 단락을 나누고 음악을 재생시키려고 하는거니까 음악이 들어가는 부분에 딱 한번만 해야하는거야\n" +
                            "        7. 밑에 내가 준 예시를 보고 \"노래\" 와 [[story]] 를 바꾸고 내용도 그에 맞게 바꿔서 주면 돼 \n" +
                            "        - story: " + request.getStory() + "\n" +
                            "        - 음악1: " + music1.getArtist() + " 의 " + music1.getTitle() + "\n" +
                            "        - 음악2: " + music2.getArtist() + " 의 " + music2.getTitle() + "\n" +
                            "        - 음악3:" + music3.getArtist() + " 의 " + music3.getTitle() + "\n" +
                            "        예시 : \n" +
                            "        안녕하세요, 여러분! 오늘 하루도 고생 정말 많으셨어요. \n" +
                            "        오늘의 이야기를 들어볼까요? \n" +
                            "        [[ 너무 힘든 하루네요. 많이 지친 하루 힐링이 필요해요 ]]\n" +
                            "        많은 분들이 바쁜 하루가 끝나고 퇴근길에 오르면 신나는 마음과 달리 지친 몸이 친구와 연인보단 침대 속을 찾게 되죠 \n" +
                            "        그러지 말고 오늘 하루정도는 오랜만에 친구를 만나 쌓인 이야기를 나누며 힐링을 찾는게 어떨까요?  \n" +
                            "        [음악1(음악1을 넣고, 괄호를 넣지마!)] 들으시면서 친구에게 연락 한번 해보세요! \n" +
                            "        @@\n" +
                            "        다음 곡입니다. 이 노래 그대로 힐링이 필요한 여러분들이 듣고 마음에 안정을 찾으셨으면 좋겠어요. (음악2에 관련된 문장 2개 넣어줘). [음악2(음악2를 넣고, 괄호를 넣지마!)] 입니다.\n" +
                            "        @@\n" +
                            "        다들 오늘의 음악들을 들으시면서 어떻게 오늘의 지친 마음을 회복할지 생각하고 계실거같은데요\n" +
                            "       좋은 시간 보내신 후에 푹 주무시길 바라요.(음악3에 관련된 문장 1개 넣어줘). 마지막곡입니다 [음악3(음악3을 넣고, 괄호를 넣지마!)] \n" +
                            "        @@ \n" +
                            "        라디오 마무리 멘트 \n" + "처음에 -story: 이렇게 시작하지말고 바로 인사하면서 스크립트를 줘."
            );

            System.setProperty("https.protocols", "TLSv1.2");

            ChatGptResponse chatGptResponse = chatGptService.askQuestion(questionRequest);
            String fullScript = chatGptResponse.getChoices().get(0).getMessage().getContent();
//        System.out.println(fullScript);
            if (fullScript != null) {
                script = fullScript.split("@@");
            }

            List<String> ttsFile = new ArrayList<>();
            List<Integer> ttsTime = new ArrayList<>();

            for (String s : script) {
                try {
                    Map<String, Object> stringObjectMap = naverTTSService.generateTTS(s, request.getDjName());

                    ttsFile.add((String) stringObjectMap.get("tts"));
                    ttsTime.add((Integer) stringObjectMap.get("time"));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }


            Oncast oncast = Oncast.builder()
                    .user(user)
                    .oncastCreateData(ocd)
                    .shareCheck(false)
                    .deleteCheck(false)
                    .selectCheck(false)
                    .scriptOne(script[0])
                    .scriptTwo(script[1])
                    .scriptThree(script[2])
                    .scriptFour(script[3])
                    .ttsOne(ttsFile.get(0))
                    .ttsTwo(ttsFile.get(1))
                    .ttsThree(ttsFile.get(2))
                    .ttsFour(ttsFile.get(3))
                    .ttsDurationOne(ttsTime.get(0))
                    .ttsDurationTwo(ttsTime.get(1))
                    .ttsDurationThree(ttsTime.get(2))
                    .ttsDurationFour(ttsTime.get(3))
                    .music1(music1)
                    .music2(music2)
                    .music3(music3)
                    .build();

            oncastCreateDataRepository.save(ocd);

            oncastRepository.save(oncast);
            System.out.println("db에 온캐스트 저장 완료");

            user.updateCreateCountPlus();

            Long oncastId = oncast.getOncastId();

            return oncast;

        }else {
            SongIdsResponse ids = callFlaskService.getMusicData(request.getStory(), request.getTheme());

            Map<String, Object> RecommendResult = musicService.recommendMusic(new MusicRecommendRequestDTO(ids.getSong_ids()));
            // ids로 데이터셋에서 조회해서 음악배열 완성하는 로직 넣기

            Object song1 = RecommendResult.get("song1");
            Object song2 = RecommendResult.get("song2");
            Object song3 = RecommendResult.get("song3");

            Map<String, Object> song1Map = (Map<String, Object>) song1;
            Long musicId1 = (Long) song1Map.get("musicId");
            Optional<Music> byId1 = musicRepository.findById(musicId1);
            Music music1 = byId1.get();

            Map<String, Object> song2Map = (Map<String, Object>) song2;
            Long musicId2 = (Long) song2Map.get("musicId");
            Optional<Music> byId2 = musicRepository.findById(musicId2);
            Music music2 = byId2.get();

            Map<String, Object> song3Map = (Map<String, Object>) song3;
            Long musicId3 = (Long) song3Map.get("musicId");
            Optional<Music> byId3 = musicRepository.findById(musicId3);
            Music music3 = byId3.get();

            System.out.println(music1.toString());

            String story = request.getStory();
            String[] script = new String[4];


            log.info(music1.toString());
            log.info(music2.toString());
            log.info(music3.toString());


            QuestionRequest questionRequest = new QuestionRequest();
            questionRequest.setQuestion(
                    "아래의 예시에 몇가지 조건을 더해서 스크립트를 만들어줘\n" +
                            "        1. 사용자의 이야기와 음악 3곡을 입력할거야\n" +
                            "        2. 글 내용에 맞는 첫 인사 후에 story를 읽어줘\n" +
                            "        3. 사연을 다 읽은 후엔 사연에 대한 이야기를 하다가 첫번째 음악을 틀거야 \n" +
                            "        4. 각 음악이 끝나면 음악과 사연에 관한 이야기를 하다가 다음 음악을 틀면 돼 \n" +
                            "        5. 음악 세개가 다 끝나고 이야기를 다 하면 마무리 인사를 하고 끝나면 돼\n" +
                            "        6. 각 음악이 들어갈 자리엔 @@ 을 넣어줘. 이부분을 체크해서 단락을 나누고 음악을 재생시키려고 하는거니까 음악이 들어가는 부분에 딱 한번만 해야하는거야\n" +
                            "        7. 밑에 내가 준 예시를 보고 \"노래\" 와 [[story]] 를 바꾸고 내용도 그에 맞게 바꿔서 주면 돼 \n" +
                            "        - story: " + request.getStory() + "\n" +
                            "        - 음악1: " + music1.getArtist() + " 의 " + music1.getTitle() + "\n" +
                            "        - 음악2: " + music2.getArtist() + " 의 " + music2.getTitle() + "\n" +
                            "        - 음악3:" + music3.getArtist() + " 의 " + music3.getTitle() + "\n" +
                            "        예시 : \n" +
                            "        안녕하세요, 여러분! 오늘 하루도 고생 정말 많으셨어요. \n" +
                            "        오늘의 이야기를 들어볼까요? \n" +
                            "        [[ 너무 힘든 하루네요. 많이 지친 하루 힐링이 필요해요 ]]\n" +
                            "        많은 분들이 바쁜 하루가 끝나고 퇴근길에 오르면 신나는 마음과 달리 지친 몸이 친구와 연인보단 침대 속을 찾게 되죠 \n" +
                            "        그러지 말고 오늘 하루정도는 오랜만에 친구를 만나 쌓인 이야기를 나누며 힐링을 찾는게 어떨까요?  \n" +
                            "        [음악1(음악1을 넣고, 괄호를 넣지마!)] 들으시면서 친구에게 연락 한번 해보세요! \n" +
                            "        @@\n" +
                            "        다음 곡입니다. 이 노래 그대로 힐링이 필요한 여러분들이 듣고 마음에 안정을 찾으셨으면 좋겠어요. (음악2에 관련된 문장 2개 넣어줘). [음악2(음악2를 넣고, 괄호를 넣지마!)] 입니다.\n" +
                            "        @@\n" +
                            "        다들 오늘의 음악들을 들으시면서 어떻게 오늘의 지친 마음을 회복할지 생각하고 계실거같은데요\n" +
                            "       좋은 시간 보내신 후에 푹 주무시길 바라요.(음악3에 관련된 문장 1개 넣어줘). 마지막곡입니다 [음악3(음악3을 넣고, 괄호를 넣지마!)] \n" +
                            "        @@ \n" +
                            "        라디오 마무리 멘트 \n" + "처음에 -story: 이렇게 시작하지말고 바로 인사하면서 스크립트를 줘."
            );

            System.setProperty("https.protocols", "TLSv1.2");

            ChatGptResponse chatGptResponse = chatGptService.askQuestion(questionRequest);
            String fullScript = chatGptResponse.getChoices().get(0).getMessage().getContent();
//        System.out.println(fullScript);
            if (fullScript != null) {
                script = fullScript.split("@@");
            }

            List<String> ttsFile = new ArrayList<>();
            List<Integer> ttsTime = new ArrayList<>();

            for (String s : script) {
                try {
                    Map<String, Object> stringObjectMap = naverTTSService.generateTTS(s, request.getDjName());

                    ttsFile.add((String) stringObjectMap.get("tts"));
                    ttsTime.add((Integer) stringObjectMap.get("time"));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }


            Oncast oncast = Oncast.builder()
                    .user(user)
                    .oncastCreateData(ocd)
                    .shareCheck(false)
                    .deleteCheck(false)
                    .selectCheck(false)
                    .scriptOne(script[0])
                    .scriptTwo(script[1])
                    .scriptThree(script[2])
                    .scriptFour(script[3])
                    .ttsOne(ttsFile.get(0))
                    .ttsTwo(ttsFile.get(1))
                    .ttsThree(ttsFile.get(2))
                    .ttsFour(ttsFile.get(3))
                    .ttsDurationOne(ttsTime.get(0))
                    .ttsDurationTwo(ttsTime.get(1))
                    .ttsDurationThree(ttsTime.get(2))
                    .ttsDurationFour(ttsTime.get(3))
                    .music1(music1)
                    .music2(music2)
                    .music3(music3)
                    .build();

            oncastCreateDataRepository.save(ocd);

            oncastRepository.save(oncast);
            System.out.println("db에 온캐스트 저장 완료");

            user.updateCreateCountPlus();

            Long oncastId = oncast.getOncastId();

            return oncast;
        }
    }

    // 온캐스트 정보 가져오기
    public Map<String, Object> getOncast() {
        User user = getUser.getUser();

        Map<String, Object> result = new HashMap<>();
        List<Oncast> oncastList = oncastRepository.findByUserUserIdAndDeleteCheckFalse(user.getUserId());
        if (oncastList.isEmpty()) {
            result.put("message", "온캐스트 없음");
            return result;
        }

        List<GetOncastDTO> oncastDTOs = oncastList.stream().map(oncast -> {

            Optional<OncastCreateData> byId = oncastCreateDataRepository.findById(oncast.getOncastCreateData().getOncastCreateDateId());
            OncastCreateData oncastCreateData = byId.get();

            String createTime = convertToFormattedString(oncast.getCreateTime());

            List<GetMusicDTO> musicDTOs = new ArrayList<>();
            musicDTOs.add(convertToDTO(oncast.getMusic1()));
            musicDTOs.add(convertToDTO(oncast.getMusic2()));
            musicDTOs.add(convertToDTO(oncast.getMusic3()));

            GetOncastDTO build = GetOncastDTO.builder()
                    .djName(oncastCreateData.getDjName())
                    .oncastId(oncast.getOncastId())
                    .theme(String.valueOf(oncastCreateData.getTheme()))
                    .createTime(createTime)
                    .title(oncastCreateData.getTitle())
                    .shareCheck(oncast.isShareCheck())
                    .selectCheck(oncast.isSelectCheck())
                    .musicList(musicDTOs).build();

            return build;
        }).collect(Collectors.toList());

        result.put("oncasts", oncastDTOs);
        return result;
    }

    // 온캐스트 공유하기
    @Transactional
    public Map<String, Object> shareOncast(Long oncastId) {
        Map<String, Object> result = new HashMap<>();

        User user = getUser.getUser();

        Optional<Oncast> byOncast = oncastRepository.findById(oncastId);

        if (byOncast.isEmpty()) {
            throw new OncastNotFoundException("존재하지 않는 온캐스트입니다.");
        }

        Oncast oncast = byOncast.get();
        if (oncast.isDeleteCheck()) {
            result.put("message", "이미 삭제된 온캐스트입니다.");
            return result;
        }
        if (oncast.isSelectCheck()) {
            result.put("message", "이미 채택된 온캐스트입니다.");
            return result;
        }
        if (oncast.isShareCheck()) {
            result.put("message", "이미 공유된 온캐스트입니다.");
            return result;
        }

        oncast.updateShareOncast();
        result.put("message", "공유하기 성공.");

        return result;
    }

    // 온캐스트 삭제하기
    public Map<String, Object> deleteOncast(Long oncastId) {
        Map<String, Object> result = new HashMap<>();

        User user = getUser.getUser();

        Optional<Oncast> byOncast = oncastRepository.findByOncastIdAndUserUserId(oncastId, user.getUserId());
        if (byOncast.isEmpty()) {
            throw new OncastNotFoundException("존재하지 않는 온캐스트입니다.");
        }

        Oncast oncast = byOncast.get();
        if (oncast.isDeleteCheck()) {
            result.put("message", "이미 삭제된 온캐스트입니다.");
            return result;
        }

        oncast.updateDeleteOncast();
        oncastRepository.save(oncast);
        result.put("message", "온캐스트 삭제 성공.");
        return result;
    }

    // 온캐스트 재생하기(정보 제공)
    public Map<String, Object> playOncast(Long oncastId) {
        Map<String, Object> result = new HashMap<>();
        User user = getUser.getUser();

        Optional<Oncast> byOncast = oncastRepository.findById(oncastId);
        if (byOncast.isEmpty()) {
            throw new OncastNotFoundException("온캐스트 정보가 없습니다.");
        }

        if (!byOncast.get().getUser().getUserId().equals(user.getUserId())) {
            throw new UnauthorizedOncastAccessException("해당 유저의 온캐스트가 아닙니다.");
        }

        Oncast oncast = byOncast.get();

        Optional<OncastCreateData> byOncastCreateData = oncastCreateDataRepository.findById(oncast.getOncastCreateData().getOncastCreateDateId());
        OncastCreateData oncastCreateData = byOncastCreateData.get();


        List<GetMusicDTO> getMusicDTOS = new ArrayList<>();

        GetMusicDTO build1 = GetMusicDTO.builder()
                .title(oncast.getMusic1().getTitle())
                .artist(oncast.getMusic1().getArtist())
                .duration(oncast.getMusic1().getDuration())
                .albumCoverUrl(oncast.getMusic1().getAlbumCoverUrl())
                .musicId(oncast.getMusic1().getMusicId())
                .youtubeId(oncast.getMusic1().getYoutubeVideoId()).build();

        GetMusicDTO build2 = GetMusicDTO.builder()
                .title(oncast.getMusic2().getTitle())
                .artist(oncast.getMusic2().getArtist())
                .duration(oncast.getMusic2().getDuration())
                .albumCoverUrl(oncast.getMusic2().getAlbumCoverUrl())
                .musicId(oncast.getMusic2().getMusicId())
                .youtubeId(oncast.getMusic2().getYoutubeVideoId()).build();

        GetMusicDTO build3 = GetMusicDTO.builder()
                .title(oncast.getMusic3().getTitle())
                .artist(oncast.getMusic3().getArtist())
                .duration(oncast.getMusic3().getDuration())
                .albumCoverUrl(oncast.getMusic3().getAlbumCoverUrl())
                .musicId(oncast.getMusic3().getMusicId())
                .youtubeId(oncast.getMusic3().getYoutubeVideoId()).build();
        getMusicDTOS.add(build1);
        getMusicDTOS.add(build2);
        getMusicDTOS.add(build3);

        OncastPlayResponseDTO build = OncastPlayResponseDTO.builder()
                .oncastId(oncast.getOncastId())
                .ttsOne(oncast.getTtsOne())
                .ttsTwo(oncast.getTtsTwo())
                .ttsThree(oncast.getTtsThree())
                .ttsFour(oncast.getTtsFour())
                .scriptOne(oncast.getScriptOne())
                .scriptTwo(oncast.getScriptTwo())
                .scriptThree(oncast.getScriptThree())
                .scriptFour(oncast.getScriptFour())
                .music(getMusicDTOS)
                .djName(oncastCreateData.getDjName()).build();

        result.put("oncast", build);
        return result;
    }

    // 라이브큐 정보 가져오기
    public Map<String, Object> getLiveQueueList() {
        Map<String, Object> result = new HashMap<>();
        User user = getUser.getUser();

        List<LiveQueue> listQueueList = liveQueueRepository.findAll();

        List<GetLiveQueueDTO> list = new ArrayList<>();
        int count = 1;
        for (LiveQueue q : listQueueList) {

            List<MusicDTO> musicList = new ArrayList<>();

            if (q.getOncast().getMusic1() != null) {
                musicList.add(MusicDTO.builder()
                        .musicId(q.getOncast().getMusic1().getMusicId())
                        .albumCoverUrl(q.getOncast().getMusic1().getAlbumCoverUrl())
                        .title(q.getOncast().getMusic1().getTitle())
                        .artist(q.getOncast().getMusic1().getArtist())
                        .build());
            }

            if (q.getOncast().getMusic2() != null) {
                musicList.add(MusicDTO.builder()
                        .musicId(q.getOncast().getMusic2().getMusicId())
                        .albumCoverUrl(q.getOncast().getMusic2().getAlbumCoverUrl())
                        .title(q.getOncast().getMusic2().getTitle())
                        .artist(q.getOncast().getMusic2().getArtist())
                        .build());
            }

            if (q.getOncast().getMusic3() != null) {
                musicList.add(MusicDTO.builder()
                        .musicId(q.getOncast().getMusic3().getMusicId())
                        .albumCoverUrl(q.getOncast().getMusic3().getAlbumCoverUrl())
                        .title(q.getOncast().getMusic3().getTitle())
                        .artist(q.getOncast().getMusic3().getArtist())
                        .build());
            }

            GetLiveQueueDTO liveQueueDTO = GetLiveQueueDTO.builder()
                    .index(count++)
                    .nickname(q.getUser().getNickname())
                    .profileImage(q.getUser().getProfileImage())
                    .title(q.getOncast().getOncastCreateData().getTitle())
                    .musicList(musicList)
                    .build();

            list.add(liveQueueDTO);
        }

        result.put("oncast", list);
        return result;
    }


    // 라이브 서버 상태 가져오기
    public Map<String, Object> getLiveServerStatus(){

        User user = getUser.getUser();

        String status = redisTemplate.opsForValue().get("server-status");

        Map<String, Object> result = new HashMap<>();
        result.put("server-status", status);

        return result;
    }

}

