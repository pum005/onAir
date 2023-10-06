package com.toy.kafka.websocket.radio;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.toy.kafka.Kafka.KafkaProducerService;
import com.toy.kafka.domain.live.entity.LiveQueue;
import com.toy.kafka.domain.live.repository.LiveQueueRepository;
import com.toy.kafka.domain.music.entity.Music;
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
            logger.info("radio Process 실행 !");
            radioProcess();
        }

    }

    public void radioProcess() throws JsonProcessingException {

        logger.info("[Radio] : 현재 라디오 상태 : " +  currentState);

        currentState = "oncast";

        logger.info("storyProcess !");
        Data data = storyProcess();

        // Data 객체를 JSON 문자열로 직렬화
        String ret = objectMapper.writeValueAsString(data);

        logger.info("radioState 로 data 보냄");
        logger.info(ret);

        kafkaProducerService.send("radioState", ret);
    }

    @Transactional
    public Data storyProcess(){

        Pageable pageable = PageRequest.of(0, 1);
        List<LiveQueue> liveQueue = liveQueueRepository.findLiveQueue(pageable);
        Long liveSequence = liveQueueRepository.findLiveSequence() + 1;

        if (liveQueue.isEmpty()) {
            logger.info("live empty!!!");
            return new Data("End", -1, null, null);
        }

        logger.info(liveQueue.toString());
        LiveQueue findLiveQueue = liveQueue.get(0);
        Oncast findOnCast = findLiveQueue.getOncast();
        findLiveQueue.updateReadCheck();
        liveQueueRepository.save(findLiveQueue);

        logger.info("[Story Process] 사연 상태를 생성합니다 {story[story_seq]}");

        String ttsOne = findOnCast.getTtsOne();
        String ttsTwo = findOnCast.getTtsTwo();
        String ttsThree = findOnCast.getTtsThree();
        String ttsFour = findOnCast.getTtsFour();
        int ttsOneLength = findOnCast.getTtsDurationOne();
        int ttsTwoLength = findOnCast.getTtsDurationTwo();
        int ttsThreeLength = findOnCast.getTtsDurationThree();
        int ttsFourLength = findOnCast.getTtsDurationFour();
        Music musicOne = findOnCast.getMusic1();
        Music musicTwo = findOnCast.getMusic2();
        Music musicThree = findOnCast.getMusic3();
        String musicOneId = findOnCast.getMusic1().getYoutubeVideoId();
        String musicTwoId = findOnCast.getMusic2().getYoutubeVideoId();
        String musicThreeId = findOnCast.getMusic3().getYoutubeVideoId();
        long musicOneLength = findOnCast.getMusic1().getDuration();
        long musicTwoLength = findOnCast.getMusic2().getDuration();
        long musicThreeLength = findOnCast.getMusic3().getDuration();
        String ttsOneScript = findOnCast.getScriptOne();
        String ttsTwoScript = findOnCast.getScriptTwo();
        String ttsThreeScript = findOnCast.getScriptThree();
        String ttsFourScript = findOnCast.getScriptFour();

        TTSDto ttsOneDto = new TTSDto("tts", ttsOneScript,ttsOne, ttsOneLength);
        TTSDto ttsTwoDto = new TTSDto("tts", ttsTwoScript, ttsTwo,ttsTwoLength);
        TTSDto ttsThreeDto = new TTSDto("tts", ttsThreeScript,ttsThree, ttsThreeLength);
        TTSDto ttsFourDto = new TTSDto("tts", ttsFourScript,ttsFour, ttsFourLength);
        MusicDto musicOneDto = new MusicDto("youtube", musicOneId, musicOneLength, musicOne.getArtist(), musicOne.getTitle(), musicOne.getAlbumCoverUrl());
        MusicDto musicTwoDto = new MusicDto("youtube", musicTwoId, musicTwoLength,musicTwo.getArtist(), musicTwo.getTitle(), musicTwo.getAlbumCoverUrl());
        MusicDto musicThreeDto = new MusicDto("youtube", musicThreeId, musicThreeLength, musicThree.getArtist(), musicThree.getTitle(), musicThree.getAlbumCoverUrl());

        String djName = findLiveQueue.getOncastCreateData().getDjName();

        PlayListDto playListDto = new PlayListDto(ttsOneDto, musicOneDto, ttsTwoDto, musicTwoDto, ttsThreeDto, musicThreeDto, ttsFourDto);


        Data data = new Data("oncast", liveSequence, djName, playListDto);

        logger.info(data.toString());

        return data;
    }


}
