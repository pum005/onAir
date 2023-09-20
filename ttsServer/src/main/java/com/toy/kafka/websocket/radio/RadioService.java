package com.toy.kafka.websocket.radio;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.toy.kafka.Kafka.KafkaProducerService;
import com.toy.kafka.domain.live.entity.LiveQueue;
import com.toy.kafka.domain.live.repository.LiveQueueRepository;
import com.toy.kafka.domain.oncast.entity.Oncast;
import com.toy.kafka.dto.playList.*;
import com.toy.kafka.dto.radio.RadioStateDto;
import com.toy.kafka.dto.radio.StoryDto;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RadioService {


    private final KafkaProducerService kafkaProducerService;

    private final LiveQueueRepository liveQueueRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final Logger logger = LoggerFactory.getLogger(RadioService.class);

    private String currentState = "";


    /**
     * kafka로부터 현재 라디오 상태와 재생할 음원들의 정보를 불러옵니다. 받아온 데이터는 파싱하고 저장합니다.
     *
     * @param message
     */
    @KafkaListener(topics = "finishState")
    public void getFinishState(String message) throws JsonProcessingException {
        logger.info("finishState 들어옴!");
        logger.info(message);
        if (message != null) {
//            logger.info(currentState);
//            if (currentState.equals("music")) {
                logger.info("radio Process 실행 !");
                radioProcess();
//            }
        }

    }

    public void radioProcess() throws JsonProcessingException {
        Queue<String> queue = new ArrayDeque<>(List.of("story", "chat", "story", "chat", "music", "chat", "music", "chat", "music", "chat"));

        logger.info("[Radio] : 현재 라디오 상태 : " +  currentState);

        currentState = queue.poll();
        queue.offer(currentState);

        RadioStateDto radioState = new RadioStateDto("idle");
        Data data = null;
        if (currentState.equals("story")) {
            logger.info("storyProcess !");
            data = storyProcess();
            radioState.setState(data.getState());
        } else if (currentState.equals("chat")) {
            radioState = new RadioStateDto("chat");
        }
//        else if (currentState.equals("music")) {
//            radioState = musicProcess();
//        }

        // Data 객체를 JSON 문자열로 직렬화
        String jsonString = objectMapper.writeValueAsString(data);

        logger.info("radioState 로 data 보냄");
        logger.info(jsonString);


        kafkaProducerService.send("radioState", jsonString);
    }

    @Transactional
    public Data storyProcess() throws JsonProcessingException {

        Pageable pageable = PageRequest.of(0, 1);
        // StoryDto storyDto = database.find_story()
        List<LiveQueue> liveQueue = liveQueueRepository.findLiveQueue(pageable);

        if (liveQueue.isEmpty()) {
            logger.info("live empty!!!");
            return new Data("empty", 1234, null);

        }

        LiveQueue findLiveQueue = liveQueue.get(0);
        Oncast findOnCast = findLiveQueue.getOncast();
        findLiveQueue.updateReadCheck();
        liveQueueRepository.save(findLiveQueue);

//        logger.info("readCheck ! : " + liveQueue.get(0).isReadCheck());
//
//        logger.info("liveQeue ID !!!!");
//        logger.info(liveQueue.get(0).getLiveQueueId().toString());
//
//        logger.info("update id : ");
//        logger.info("live queue !");
//        logger.info(liveQueue.get(0).toString());
//        logger.info("Live Queue !!");

        StoryDto storyDto = new StoryDto("hello world", "hello world", new ArrayList<>(), "hello world", "hello world", "./tts/story/");

//        if (storyDto != null) {
//            return new Data("idle", 0, null);
//        }

        logger.info("[Story Process] 사연 상태를 생성합니다 {story[story_seq]}");

        String storyContent = storyDto.getStoryContent();
        List<String> storyContentList = storyDto.getStoryContentList();
        String storyReaction = storyDto.getStoryReaction();
        String storyOutro = storyDto.getStoryOutro();
        String ttsPath = "./tts/story/";

        String storyReactionFileName = ttsPath + "story_reaction.mp3";
        String storyOutroFileName = ttsPath + "outro.mp3";

        String ttsOne = findOnCast.getTtsOne();
        String ttsTwo = findOnCast.getTtsTwo();
        String ttsThree = findOnCast.getTtsThree();
        String ttsFour = findOnCast.getTtsFour();
        String musicOne = findOnCast.getMusic1().getYoutubeVideoId();
        String musicTwo = findOnCast.getMusic2().getYoutubeVideoId();
        String musicThree = findOnCast.getMusic3().getYoutubeVideoId();

        // tts 생성

        // Story TTS 생성 후 Merge

        // merged_story_tts 와 story_reaction_file merge

        // intro_length, outro_length 구하기

        // intro_url, outro_url 만들기

        // story에 readed 상태 업데이트, 누가 업데이트 했는지 적기

        // playlist path : intro_url 로 바꾸기


        TTSDto ttsOneDto = new TTSDto("tts", ttsOne);
        TTSDto ttsTwoDto = new TTSDto("tts", ttsTwo);
        TTSDto ttsThreeDto = new TTSDto("tts", ttsThree);
        TTSDto ttsFourDto = new TTSDto("tts", ttsFour);
        MusicDto musicOneDto = new MusicDto("youtube", musicOne, "artist", "title", "image");
        MusicDto musicTwoDto = new MusicDto("youtube", musicTwo, "artist", "title", "image");
        MusicDto musicThreeDto = new MusicDto("youtube", musicThree, "artist", "title", "image");

        PlayListDto playListDto = new PlayListDto(ttsOneDto, ttsTwoDto, ttsThreeDto, ttsFourDto, musicOneDto, musicTwoDto, musicThreeDto);

        Data data = new Data("oncast", findLiveQueue.getLiveQueueId().intValue(), playListDto);

        logger.info(data.toString());
        // story_reaction_file 제거
        // merged_story_tts_file 제거
        // story_tts_list 제거

        return data;

    }


}
