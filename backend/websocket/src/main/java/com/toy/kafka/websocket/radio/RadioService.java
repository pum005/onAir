package com.toy.kafka.websocket.radio;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.toy.kafka.Kafka.KafkaProducerService;
import com.toy.kafka.dto.playList.Data;
import com.toy.kafka.dto.playList.PlayListDto;
import com.toy.kafka.dto.radio.CurrentSoundDto;
import com.toy.kafka.dto.socket.SocketBaseDto;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.Queue;

@Service
@RequiredArgsConstructor
public class RadioService {

    private final KafkaProducerService kafkaProducerService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private String currentState = "idle";

    private static final Logger logger = LoggerFactory.getLogger(RadioService.class);

    private long logTimer = 0L;

    private String type = "none";
    private String path = "";
    private long length = 0L;
    private String title = "";
    private String artist = "";
    private String image = "";
    private long typeStartTime = System.currentTimeMillis();
    private long startTime = System.currentTimeMillis();
    private String script = "";

    private String djName = "";
    private Queue<PlayListDto> playlist = new LinkedList<PlayListDto>();

    //
    private long seq = 1L;
    private long idleTimer = 0L;
    private long chatTimer = 0L;

    // socket

    private final SimpMessagingTemplate simpMessagingTemplate;


    /**
     * kafka로부터 현재 라디오 상태와 재생할 음원들의 정보를 불러옵니다. 받아온 데이터는 파싱하고 저장합니다.
     *
     * @param message
     */
    @KafkaListener(topics = "radioState")
    public void getRadioState(String message) {
        if (message != null) {
            logger.info("수신한 라디오 상태 데이터 : " + message);

            parseJsonMessageAndSetState(message);
        }
    }

    /**
     * kafka로부터 받아온 메세지를 파싱하여 라디오 상태에 저장합니다.
     *
     * @param message
     */
    private void parseJsonMessageAndSetState(String message) {
        logger.info("parseJson message : " + message);
        try {
            // 문자열을 Data 객체로 변환
            JsonNode jsonNode = objectMapper.readTree(message);

            updateState(jsonNode);
            updateSeq(jsonNode);
            updateDjName(jsonNode);
            updatePlaylist(jsonNode);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * kafka로부터 받아온 메세지를 파싱하여 라디오 DJ Name에 저장합니다.
     *
     * @param message
     */
    private void updateDjName(JsonNode jsonNode) {
        if (jsonNode.has("djName")) {
            JsonNode currentSeqNode = jsonNode.get("djName");
            djName = currentSeqNode.asText();
        }
    }

    private void updateSeq(JsonNode jsonNode) {
        seq = 0L;
        if (jsonNode.has("seq")) {
            JsonNode currentSeqNode = jsonNode.get("seq");
            seq = currentSeqNode.asLong();
        }
    }

    /**
     * 받아온 radioState에서 playlist가 존재하는지 확인하고 업데이트
     *
     * @param jsonNode
     */
    private void updatePlaylist(JsonNode jsonNode) {
        if (jsonNode.has("playListDto")) {

            JsonNode playlistNode = jsonNode.get("playListDto");

            for (JsonNode itemNode : playlistNode) {

                String type = itemNode.get("type").asText();
                String path = itemNode.get("path").asText();
                long length = itemNode.get("length").asLong() + 3000L;
                String title = "";
                String artist = "";
                String image = "";
                String script = "";
                if (itemNode.has("script")) {
                    script = itemNode.get("script").asText();
                }
                if (itemNode.has("title")) {
                    title = itemNode.get("title").asText();
                    artist = itemNode.get("artist").asText();
                    image = itemNode.get("image").asText();
                }
                playlist.add(PlayListDto.builder()
                        .type(type)
                        .path(path)
                        .length(length)
                        .title(title)
                        .artist(artist)
                        .image(image)
                        .script(script)
                        .build());
            }
        }
    }

    /**
     * 받아온 radioState에서 state가 존재하는지 확인하고 업데이트
     *
     * @param jsonNode
     */
    private void updateState(JsonNode jsonNode) {
        if (jsonNode.has("state")) {
            JsonNode currentStateNode = jsonNode.get("state");
            String tempState = currentStateNode.asText();
            if (!tempState.equals(currentState)) {
                playlist.clear();
            }
            currentState = tempState;
            logger.info("currentState : " + currentState);
        }
    }

    /**
     * 1초마다 라디오 상태를 갱신하는 로직입니다. idle 상태가 지속되면 강제로 finishState에 메세지를 보냅니다.
     */
    @Scheduled(cron = "0 0 11 * * *", zone = "Asia/Seoul")// 매일 11시부터 13시까지 1초 간격으로 실
    public void startServer() {
        currentState = "idle";
    }

    /**
     * 매일 00시 마다, 라이브 시작 전 상태로 변경.
     */
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")// 매일 11시부터 13시까지 1초 간격으로 실
    public void setServerStatusToBefore() {
        currentState = "Before";
    }


    /**
     * 1초마다 라디오 상태를 갱신하는 로직입니다. idle 상태가 지속되면 강제로 finishState에 메세지를 보냅니다.
     */
    @Scheduled(fixedRate = 1000)// 매일 11시부터 13시까지 1초 간격으로 실
    public void checkAndPlayNextItem() {
        if ( currentState.equals("Before")) {
            logger.info("Before!!");
            return;
        }
        if ( currentState.equals("End") ) {
            logger.info("End!!");
            return;
        }
        logRadioStatus();
        logger.info(currentState);
        for (PlayListDto playListDto : playlist) {
            logger.info("path : " + playListDto.getPath());
        }
        switch (currentState) {
            case "idle":
                idleProcess();
                break;
            default:
                radioProcess();
        }
    }

    /**
     * 현재 재생해야 하는 Sound를 사용자에게 보내는 로직입니다.
     */
    private void sendCurrentSound(boolean isChanged) {
        CurrentSoundDto currentSound = getCurrentSound();
        if (isChanged) {
//            currentSound.setTypePlayedTime(0L);
            currentSound.setPlayedTime(0L);
        }
        SocketBaseDto<CurrentSoundDto> socketBaseDto = SocketBaseDto.<CurrentSoundDto>builder()
                .type("RADIO")
                .operation(currentState.toUpperCase())
                .data(currentSound)
                .build();
        simpMessagingTemplate.convertAndSend("/topic", socketBaseDto);
    }

    /**
     * 현재 재생해야 하는 Sound를 반환하는 로직입니다.
     *
     * @return
     */
    public CurrentSoundDto getCurrentSound() {
        long currentTime = System.currentTimeMillis();
        CurrentSoundDto currentSound = CurrentSoundDto.builder()
                .type(type)
//                .typePlayedTime(currentTime - typeStartTime)
                .path(path)
//                .startTime(startTime)
                .playedTime(currentTime - startTime)
                .length(length)
                .title(title)
                .artist(artist)
                .image(image)
                .script(script)
                .seq(seq)
                .djName(djName)
                .build();
        return currentSound;
    }

    /**
     * idle 상태가 얼마나 지속되었는지 체크하는 로직입니다. 30초 이상 idle 상태가 지속된다면 라디오 서버에 강제로 finishState 이벤트를 보냅니다.
     */
    public void idleProcess() {
        logger.info("idle Process !");
        logger.info(Long.toString(idleTimer));
        if (idleTimer == 0) {
            logger.info("서버에서 상태를 받아올 수 없습니다. 서버에 요청을 보냅니다.");
            try {
                resetTimer();
                logger.info("kafka finishState 에 idle 보냄!");
                kafkaProducerService.send("finishState", "idle");
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        } else {
            --idleTimer;
        }
    }

    /**
     * 라디오 진행 로직입니다. 현재 재생중인 음원의 길이를 초과하면 음원을 다음 음원으로 바꿉니다. 만약 playlist가 비어있다면 다음 상태를 요청하는 메세지를
     * fastAPI로 보냅니다.
     */
    public void radioProcess() {
        logger.info("radio Process !");
        resetTimer();
        long currentTime = System.currentTimeMillis();
        if (checkSoundChange()) {
            if (playlist.isEmpty() && currentTime - startTime > length) {
                kafkaProducerService.send("finishState", currentState);
                resetState();
            }
            System.out.println("현재 재생목록을 cliet에게 보냄!!");
            sendCurrentSound(true);
        }
    }

    public int millisecondsToRoundedSeconds(int milliseconds) {
        return (int) Math.ceil((double) milliseconds / 1000);
    }

    /**
     * 음원이 바뀌어야하는지 확인하는 로직입니다.
     *
     * @return
     */
    public boolean checkSoundChange() {
        long currentTime = System.currentTimeMillis();
        logger.info("플레이 리스트 남은 곡 : " + playlist.size());
        logger.info("현재 플레이리스트 순서 : " + (7 - playlist.size() + 1));
        logger.info("현재 재생 시간 : " + millisecondsToRoundedSeconds((int)(currentTime - startTime)));
        logger.info("음악의 길이 : " + millisecondsToRoundedSeconds((int) length));
        if (currentTime - startTime > length) {
            logger.info("재생 시간 초과~~");
            if (!playlist.isEmpty()) {
                logger.info("음원 파일 있어서 바꾼대...");
                PlayListDto sound = playlist.poll();
                type = sound.getType();
                path = sound.getPath();
                length = sound.getLength();
                title = sound.getTitle();
                artist = sound.getArtist();
                image = sound.getImage();
                startTime = currentTime;
                script = sound.getScript();
            }
            return true;
        }
        return false;
    }

    /**
     * Springboot App의 라디오 상태를 지우는 함수.
     */
    private void resetState() {
        currentState = "idle";
        resetInfo();
    }

    private void resetInfo() {
        type = "none";
        path = "";
        title = "";
        artist = "";
        image = "";
        script = "";
        djName = "";
        startTime = System.currentTimeMillis();
        length = 0L;
        playlist.clear();
    }

    private void resetTimer() {
        idleTimer = 5;
        chatTimer = 60;
    }

    /**
     * 라디오의 현재 상태를 로그로 출력하는 함수
     */
    private void logRadioStatus() {
        logTimer++;
        if (logTimer % 1 == 0) {
            logger.info(
                    "라디오 상태: {} | 음원 타입: {} | 음원 경로: {} | 경과 시간: {} | 음원 길이: {} | 현재 큐에 들어있는 음원 수: {} | djName: {}",
                    currentState, type, path, System.currentTimeMillis() - startTime, length,
                    playlist.size(), djName);
        }
    }

    /**
     * 현재 상태를 반환하는 로직입니다.
     *
     * @return
     */
    public String getCurrentState() {
        return currentState;
    }
}
