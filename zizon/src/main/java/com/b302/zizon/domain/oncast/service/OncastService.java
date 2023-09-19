package com.b302.zizon.domain.oncast.service;

import com.b302.zizon.domain.music.entity.Music;
import com.b302.zizon.domain.oncast.dto.request.OncastRequestDto;
import com.b302.zizon.domain.oncast.dto.response.GetMusicDTO;
import com.b302.zizon.domain.oncast.dto.response.GetOncastDTO;
import com.b302.zizon.domain.oncast.dto.response.OncastPlayResponseDTO;
import com.b302.zizon.domain.oncast.entity.Oncast;
import com.b302.zizon.domain.oncast.entity.OncastCreateData;
import com.b302.zizon.domain.oncast.repository.OncastCreateDataRepository;
import com.b302.zizon.domain.oncast.repository.OncastRepository;
import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.domain.user.repository.UserRepository;
import com.b302.zizon.util.gpt.dto.ChatGptResponse;
import com.b302.zizon.util.gpt.dto.QuestionRequest;
import com.b302.zizon.util.gpt.service.ChatGptService;
import com.b302.zizon.util.tts.service.NaverTTSService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Transactional
@Slf4j
public class OncastService {

    private final NaverTTSService naverTTSService;
    private final OncastRepository oncastRepository;
    private final ChatGptService chatGptService;
    private final UserRepository userRepository;
    private final OncastCreateDataRepository oncastCreateDataRepository;

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

    public Long getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userId = (Long) principal;

        return userId;
    }

    // 시간 변환 포맷
    public String convertToFormattedString(LocalDateTime dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM월 dd일 (E) HH:mm");
        return dateTime.format(formatter);
    }

    // 온캐스트 저장
    public Oncast saveOncast(OncastRequestDto request, String[] oncastMusic) {

        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();


        String story = request.getStory();
        String[] script = new String[4];
        String[] tts = new String[4];


        String exstory = "오늘 하루종일 비가 와서 너무 힘들었습니다. 비가 오는날마다 너무 습하고 밖을 못돌아다녀서요. " +
                "저는 밖에서 산책하고 사람들을 만나는걸 좋아하기 때문이에요.\n" +
                "비오는날에도 행복할 수 있게 비를 맘껏 즐길 수 있는 하루가 되었으면 좋겠어요!";

        String exmusic1 = "잔나비" + "의 " + "November Rain";
        String exmusic2 = "태연" + "의 " + "Rain";
        String exmusic3 = "선우정아" + "의 " + "비온다";

        QuestionRequest questionRequest = new QuestionRequest();
        questionRequest.setQuestion(
                "라디오 스크립트를 만들어줘\n" +
                        "1. 사용자의 사연과 음악 3곡을 입력할거야\n" +
                        "2. 사연 내용에 맞는 첫 인사 후에 사연을 읽어줘\n" +
                        "3. 사연을 다 읽은 후엔 사연에 대한 이야기를 하다가 첫번째 음악을 틀거야\n" +
                        "4. 각 음악이 끝나면 음악과 사연에 관한 이야기를 하다가 다음 음악을 틀면 돼\n" +
                        "5. 음악 세개가 다 끝나고 이야기를 다 하면 마무리 인사를 하고 끝나면 돼\n" +
                        "6. 각 음악이 들어갈 자리엔 \"//\" 를 넣어줘\n" +
                        "\n" +
                        "- 사연: \n" +
                        exstory + // story
                        "- 음악1: " + exmusic1 +
                        "- 음악2: " + exmusic2 +
                        "- 음악3: " + exmusic3
        );


        ChatGptResponse chatGptResponse = chatGptService.askQuestion(questionRequest);
        String fullScript = chatGptResponse.getChoices().get(0).getMessage().getContent();

        if (fullScript != null) {
            script = fullScript.split("//");
        }

        List<String> f = new ArrayList<>();

        for (String s : script) {
            try {
                String str = naverTTSService.generateTTS(s, request.getDjName());

                f.add(str);
            }catch (IOException e){
                e.printStackTrace();
            }
        }




        // f 리스트 s3에 저장해서 tts 배열에 싹 넣기

        String sc1tmp = script[0]; // 사연 가져온거 잘라서 넣어야함
        String sc2tmp = script[1];
        String sc3tmp = script[2];
        String sc4tmp = script[3];
        System.out.println(Arrays.toString(script));

        String ts1tmp = tts[0]; // 자른거 tts에 넣고
        String ts2tmp = tts[1]; // 돌려받은 mp3 파일 s3에 저장
        String ts3tmp = tts[2]; // s3 경로 가져와서 각각 넣기
        String ts4tmp = tts[3];
        String om1tmp = oncastMusic[0]; // 음악 유튜브 url로 받음
        String om2tmp = oncastMusic[1]; // url로 다운 후 s3에 저장
        String om3tmp = oncastMusic[2]; // 경로 가져와서 각각 넣기

        Oncast oncast = Oncast.builder()
                .user(user)
                .createTime(LocalDateTime.now())
                .shareCheck(false)
                .deleteCheck(false)
                .selectCheck(false)
                .scriptOne(script[0])
                .scriptTwo(script[1])
                .scriptThree(script[2])
                .scriptFour(script[3])
                .ttsOne(f.get(0))
                .ttsTwo(f.get(1))
                .ttsThree(f.get(2))
                .ttsFour(f.get(3))
//                .oncastMusicOne(om1tmp)
//                .oncastMusicTwo(om2tmp)
//                .oncastMusicThree(om3tmp)
                .build();

        oncastRepository.save(oncast);


        return oncast;
    }

    // 온캐스트 정보 가져오기
    public Map<String, Object> getOncast() {

        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

        Map<String, Object> result = new HashMap<>();
        List<Oncast> oncastList = oncastRepository.findByUserUserIdAndDeleteCheckFalse(userId);
        if (oncastList.isEmpty()) {
            result.put("message", "온캐스트 없음");
            return result;
        }

        List<GetOncastDTO> oncastDTOs = oncastList.stream().map(oncast -> {

            Optional<OncastCreateData> byId = oncastCreateDataRepository.findById(oncast.getOncastCreateData().getOncastCreateDateId());
            OncastCreateData oncastCreateData = byId.get();

            String createTime = convertToFormattedString(oncast.getCreateTime());

            GetOncastDTO oncastDTO = new GetOncastDTO();
            oncastDTO.setOncastId(oncast.getOncastId());
            oncastDTO.setCreateTime(createTime);
            oncastDTO.setTitle(oncastCreateData.getTitle());
            oncastDTO.setShareCheck(oncast.isShareCheck());
            oncastDTO.setSelectCheck(oncast.isSelectCheck());

            List<GetMusicDTO> musicDTOs = new ArrayList<>();
            musicDTOs.add(convertToDTO(oncast.getMusic1()));
            musicDTOs.add(convertToDTO(oncast.getMusic2()));
            musicDTOs.add(convertToDTO(oncast.getMusic3()));

            oncastDTO.setMusicList(musicDTOs);
            return oncastDTO;
        }).collect(Collectors.toList());

        result.put("oncasts", oncastDTOs);
        return result;
    }

    // 온캐스트 공유하기
    @Transactional
    public Map<String, Object> shareOncast(Long oncastId) {
        Map<String, Object> result = new HashMap<>();

        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

        Optional<Oncast> byOncast = oncastRepository.findById(oncastId);

        if (byOncast.isEmpty()) {
            throw new IllegalArgumentException("존재하지 않는 온캐스트입니다.");
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

        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

        Optional<Oncast> byOncast = oncastRepository.findByOncastIdAndUserUserId(oncastId, userId);
        if (byOncast.isEmpty()) {
            throw new IllegalArgumentException("존재하지 않는 온캐스트입니다.");
        }

        Oncast oncast = byOncast.get();
        if (oncast.isDeleteCheck()) {
            result.put("message", "이미 삭제된 온캐스트입니다.");
            return result;
        }

        oncast.updateDeleteOncast();
        result.put("message", "온캐스트 삭제 성공.");
        return result;
    }

//    // 온캐스트 재생하기(정보 제공)
//    public void playOncast(Long oncastId){
//        Long userId = getUserId();
//
//        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
//                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));
//
//        User user = byUserId.get();
//
//        Optional<Oncast> byOncast = oncastRepository.findById(oncastId);
//        if(byOncast.isEmpty()){
//            throw new IllegalArgumentException("온캐스트 정보가 없습니다.");
//        }
//
//        Oncast oncast = byOncast.get();
//
//        List<GetMusicDTO> getMusicDTOS = new ArrayList<>();
//        for()
//
//        OncastPlayResponseDTO.builder()
//                .ttsOne(oncast.getTtsOne())
//                .ttsTwo(oncast.getTtsTwo())
//                .ttsThree(oncast.getTtsThree())
//                .ttsFour(oncast.getTtsFour())
//                .scriptOne(oncast.getScriptOne())
//                .scriptTwo(oncast.getScriptTwo())
//                .scriptThree(oncast.getScriptThree())
//                .scriptFour(oncast.getTtsFour())
//                .
//    }
}

