package com.b302.zizon.domain.oncast.service;

import com.b302.zizon.domain.music.entity.Music;
import com.b302.zizon.domain.oncast.dto.request.OncastRequestDto;
import com.b302.zizon.domain.oncast.dto.response.GetMusicDTO;
import com.b302.zizon.domain.oncast.dto.response.GetOncastDTO;
import com.b302.zizon.domain.oncast.entity.Oncast;
import com.b302.zizon.domain.oncast.entity.OncastCreateData;
import com.b302.zizon.domain.oncast.repository.OncastCreateDataRepository;
import com.b302.zizon.domain.oncast.repository.OncastRepository;
import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.domain.user.repository.UserRepository;
import com.b302.zizon.util.gpt.dto.ChatGptResponse;
import com.b302.zizon.util.gpt.dto.QuestionRequest;
import com.b302.zizon.util.gpt.service.ChatGptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class OncastService {

    private final OncastRepository oncastRepository;
    private final ChatGptService chatGptService ;
    private final UserRepository userRepository;
    private final OncastCreateDataRepository oncastCreateDataRepository;
    public Long getUserId(){
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

    public Oncast saveOncast(OncastRequestDto request, String[] oncastMusic){

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
                        "- 음악1: "+ exmusic1 +
                        "- 음악2: "+ exmusic2 +
                        "- 음악3: "+ exmusic3
        );



        ChatGptResponse chatGptResponse = chatGptService.askQuestion(questionRequest);
        String fullScript  = chatGptResponse.getChoices().get(0).getMessage().getContent();

        if(fullScript!=null){
            script = fullScript.split("//");
        }

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
                .scriptOne(sc1tmp)
                .scriptTwo(sc2tmp)
                .scriptThree(sc3tmp)
                .scriptFour(sc4tmp)
                .ttsOne(ts1tmp)
                .ttsTwo(ts2tmp)
                .ttsThree(ts3tmp)
                .ttsFour(ts4tmp)
//                .oncastMusicOne(om1tmp)
//                .oncastMusicTwo(om2tmp)
//                .oncastMusicThree(om3tmp)
                .build();

        oncastRepository.save(oncast);


        return oncast;
    }

    public Map<String, Object> getOncast(){

        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

        Map<String, Object> result = new HashMap<>();
        List<Oncast> oncastList = oncastRepository.findByUserUserIdAndDeleteCheckFalse(userId);
        if(oncastList.isEmpty()){
            result.put("message", "온캐스트 없음");
            return result;
        }

        List<GetOncastDTO> oncastDTOs = oncastList.stream().map(oncast -> {

            Optional<OncastCreateData> byId = oncastCreateDataRepository.findById(oncast.getOncastCreateData().getOncastCreateDateId());
            OncastCreateData oncastCreateData = byId.get();

            String createTime = convertToFormattedString(oncast.getCreateTime());

            GetOncastDTO oncastDTO = new GetOncastDTO();
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

    private GetMusicDTO convertToDTO(Music music){
            GetMusicDTO musicDTO = new GetMusicDTO();
            musicDTO.setMusicId(music.getMusicId());
            musicDTO.setTitle(music.getTitle());
            musicDTO.setArtist(music.getArtist());
            musicDTO.setAlbumCoverUrl(music.getAlbumCoverUrl());
            musicDTO.setDuration(music.getDuration());
            return musicDTO;
        }

}

