package com.b302.zizon.domain.oncast.service;

import com.b302.zizon.domain.music.entity.Music;
import com.b302.zizon.domain.music.entity.ThemeEnum;
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

    @Transactional
    // 온캐스트 저장
    public Oncast saveOncast(OncastRequestDto request) {

        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

//        String exstory = "오늘 하루종일 비가 와서 너무 힘들었습니다. 비가 오는날마다 너무 습하고 밖을 못돌아다녀서요. " +
//                "저는 밖에서 산책하고 사람들을 만나는걸 좋아하기 때문이에요.\n" +
//                "비오는날에도 행복할 수 있게 비를 맘껏 즐길 수 있는 하루가 되었으면 좋겠어요!";

        OncastCreateData ocd = OncastCreateData.builder()
                .title(request.getTitle())
                .theme(request.getTheme())
                .story(request.getStory())
                .djName(request.getDjName())
                .build();


        // 음악 추천받는 로직
        Music[] oncastMusic = new Music[3];



        String story = request.getStory();
        String[] script = new String[4];



        oncastMusic[0] = Music.builder()
                .artist("잔나비")
                .title("November Rain")
                .build();

        oncastMusic[1] = Music.builder()
                .artist("태연")
                .title("Rain")
                .build();

        oncastMusic[2] = Music.builder()
                .artist("선우정아")
                .title("비온다")
                .build();





        QuestionRequest questionRequest = new QuestionRequest();
        questionRequest.setQuestion(
            "라디오 스크립트를 만들어줘\n" +
                    "1. 사용자의 이야기와 음악 3곡, DJ이름을 입력할거야\n" +
                    "2. 글 내용에 맞는 첫 인사 후에 story를 읽어줘  클라이언트에서 [[ ]] 로 인식해서 재생할거라서 입력한 부분을 [[ ]]로 감싸주면 될거같아\n" +
                    "3. 사연을 다 읽은 후엔 사연에 대한 이야기를 하다가 첫번째 음악을 틀거야\n" +
                    "4. 각 음악이 끝나면 음악과 사연에 관한 이야기를 하다가 다음 음악을 틀면 돼\n" +
                    "5. 음악 세개가 다 끝나고 이야기를 다 하면 마무리 인사를 하고 끝나면 돼\n" +
                    "6. 각 음악이 들어갈 자리엔 [++] 를 넣어줘. 이부분을 체크해서 단락을 나누고 음악을 재생시키려고 하는거니까 음악이 들어가는 부분에 딱 한번만 해야하는거야\n" +
                    "7. 너의 이름은 DJ이름으로 넣어줄거고 진행 방식은 너 혼자 하는거고 대본처럼 말고 줄글로 쭉 답변을 주면돼\n" +
                    "- story: \n" +
                    request.getStory() + // story
                    "- 음악1: " + oncastMusic[0].getArtist() +"의 "+oncastMusic[0].getTitle()+
                    "- 음악2: " + oncastMusic[1].getArtist() +"의 "+oncastMusic[1].getTitle()+
                    "- 음악3: " + oncastMusic[2].getArtist() +"의 "+oncastMusic[2].getTitle()+
                    "- DJ: "+ request.getDjName()
        );


        ChatGptResponse chatGptResponse = chatGptService.askQuestion(questionRequest);
        String fullScript = chatGptResponse.getChoices().get(0).getMessage().getContent();
//        System.out.println(fullScript);
        if (fullScript != null) {
            script = fullScript.split("[++]");
        }

        List<String> f = new ArrayList<>();
//        System.out.println(fullScript);
//        System.out.println("===================================");
//        System.out.println(Arrays.toString(script));
//        System.out.println("===================================");
//        for (String s : script){
////            System.out.println("--------------------------------------------------------");
//            System.out.println(s);
//        }
//        System.out.println(fullScript);
        for (String s : script) {
            try {
                String str = naverTTSService.generateTTS(s, request.getDjName());

                f.add(str);
            }catch (IOException e){
                e.printStackTrace();
            }
        }
        System.out.println("tts완료");
        for(String s : f){
            System.out.println(s);
        }
        System.out.println("<<여기까지 tts 파일");

        f.add("");
        f.add("");
        f.add("");
        f.add("");



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
                .ttsOne(f.get(0))
                .ttsTwo(f.get(1))
                .ttsThree(f.get(2))
                .ttsFour(f.get(3))
                .music1(oncastMusic[0])
                .music2(oncastMusic[1])
                .music3(oncastMusic[2])
                .build();

        System.out.println("온캐스트 빌드 끝");
        oncastRepository.save(oncast);
        System.out.println("db에 온캐스트 저장 완료");


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

        if(byOncast.isEmpty()) {
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

    // 온캐스트 재생하기(정보 제공)
    public Map<String, Object> playOncast(Long oncastId){
        Map<String, Object> result = new HashMap<>();
        Long userId = getUserId();

        Optional<User> byUserId = Optional.ofNullable(userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("pk에 해당하는 유저 존재하지 않음")));

        User user = byUserId.get();

        Optional<Oncast> byOncast = oncastRepository.findById(oncastId);
        if(byOncast.isEmpty()){
            throw new IllegalArgumentException("온캐스트 정보가 없습니다.");
        }

        if(!byOncast.get().getUser().getUserId().equals(userId)){
            throw new IllegalArgumentException("해당 유저의 온캐스트가 아닙니다.");
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
                .scriptFour(oncast.getTtsFour())
                .music(getMusicDTOS)
                .djName(oncastCreateData.getDjName()).build();

        result.put("oncast", build);
        return result;
    }
}

