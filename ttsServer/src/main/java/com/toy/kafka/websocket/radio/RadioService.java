package com.toy.kafka.websocket.radio;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.toy.kafka.Kafka.KafkaProducerService;
import com.toy.kafka.domain.live.entity.LiveQueue;
import com.toy.kafka.domain.live.repository.LiveQueueRepository;
import com.toy.kafka.domain.oncast.entity.Oncast;
import com.toy.kafka.dto.playList.Data;
import com.toy.kafka.dto.playList.MusicDto;
import com.toy.kafka.dto.playList.PlayListDto;
import com.toy.kafka.dto.playList.TTSDto;
import com.toy.kafka.dto.radio.RadioStateDto;
import com.toy.kafka.dto.radio.StoryDto;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

@Service
@RequiredArgsConstructor
public class RadioService {


    private final KafkaProducerService kafkaProducerService;

    private final LiveQueueRepository liveQueueRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final Logger logger = LoggerFactory.getLogger(RadioService.class);

    private String currentState = "";

    public int millisecondsToRoundedSeconds(Long milliseconds) {
        return (int) Math.ceil((double) milliseconds / 1000);
    }

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

    @Scheduled(cron = "0 0 17 * * *")// 매일 11시부터 13시까지 1초 간격으로 실
    public void startWebSocketServer() {
        logger.info("websocket server 실행!!");
        commandWebSocketServer("start");
    }

    public void commandWebSocketServer(String startOrStop) {

        try {
            String containerId = "WebSocket-Server"; // 중지할 컨테이너의 ID 또는 이름
            String[] command = {"sudo", "docker", startOrStop, containerId};

            ProcessBuilder processBuilder = new ProcessBuilder(command);
            Process process = processBuilder.start();

            int exitCode = process.waitFor();

            if (exitCode == 0) {
                System.out.println("명령어가 성공적로 실행 되었습니다.");
            } else {
                System.out.println("명령어가 실행 중 오류가 발생했습니다.");
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void radioProcess() throws JsonProcessingException {
        Queue<String> queue = new ArrayDeque<>(List.of("oncast", "chat", "story", "chat", "music", "chat", "music", "chat", "music", "chat"));

        logger.info("[Radio] : 현재 라디오 상태 : " +  currentState);

        currentState = queue.poll();
        queue.offer(currentState);

        RadioStateDto radioState = new RadioStateDto("idle");
        Data data = null;
        if (currentState.equals("oncast")) {
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

        List<LiveQueue> liveQueue = liveQueueRepository.findLiveQueue(pageable);

        if (liveQueue.isEmpty()) {
            logger.info("live empty!!!");
            commandWebSocketServer("stop");
            return new Data("idle", 1234, null);
        }

        LiveQueue findLiveQueue = liveQueue.get(0);
        Oncast findOnCast = findLiveQueue.getOncast();
        findLiveQueue.updateReadCheck();
        liveQueueRepository.save(findLiveQueue);

        StoryDto storyDto = new StoryDto("hello world", "hello world", new ArrayList<>(), "hello world", "hello world", "./tts/story/");

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
        int ttsOneLength = 10;
        int ttsTwoLength = 10;
        int ttsThreeLength = 10;
        int ttsFourLength = 10;
        String musicOne = findOnCast.getMusic1().getYoutubeVideoId();
        String musicTwo = findOnCast.getMusic2().getYoutubeVideoId();
        String musicThree = findOnCast.getMusic3().getYoutubeVideoId();
        int musicOneLength = millisecondsToRoundedSeconds(findOnCast.getMusic1().getDuration());
        int musicTwoLength = millisecondsToRoundedSeconds(findOnCast.getMusic2().getDuration());
        int musicThreeLength = millisecondsToRoundedSeconds(findOnCast.getMusic3().getDuration());

        TTSDto ttsOneDto = new TTSDto("tts", ttsOne, ttsOneLength);
        TTSDto ttsTwoDto = new TTSDto("tts", ttsTwo,ttsTwoLength);
        TTSDto ttsThreeDto = new TTSDto("tts", ttsThree, ttsThreeLength);
        TTSDto ttsFourDto = new TTSDto("tts", ttsFour, ttsFourLength);
        MusicDto musicOneDto = new MusicDto("youtube", musicOne, musicOneLength, "artist", "title", "image");
        MusicDto musicTwoDto = new MusicDto("youtube", musicTwo, musicTwoLength,"artist", "title", "image");
        MusicDto musicThreeDto = new MusicDto("youtube", musicThree, musicThreeLength, "artist", "title", "image");

        PlayListDto playListDto = new PlayListDto(ttsOneDto, musicOneDto, ttsTwoDto, musicTwoDto, ttsThreeDto, musicThreeDto, ttsFourDto);

        Data data = new Data("oncast", findLiveQueue.getLiveQueueId().intValue(), playListDto);

        logger.info(data.toString());

        return data;
    }


}
