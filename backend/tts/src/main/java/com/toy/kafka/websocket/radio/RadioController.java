package com.toy.kafka.websocket.radio;

import com.toy.kafka.util.SessionUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class RadioController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    /**
     * 소켓에 구독 신청을 보내면 현재 라디오의 정보를 반환합니다.
     *
     * @param sessionId
     */
    @MessageMapping("/subscribe")
    public void subscribeToRadio(@Header("simpSessionId") String sessionId) {
//        CurrentSoundDto currentSound = radioService.getCurrentSound();
//        SocketBaseDto<CurrentSoundDto> socketBaseDto = SocketBaseDto.<CurrentSoundDto>builder()
//                .type("RADIO")
//                .operation(radioService.getCurrentState().toUpperCase())
//                .data(currentSound)
//                .build();
        System.out.println("radio controller 들어왔으!");
        simpMessagingTemplate.convertAndSendToUser(sessionId, "/queue", "radio",
                SessionUtil.createHeaders(sessionId));
    }
}
