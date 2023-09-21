package com.toy.kafka.websocket.chat;

import com.toy.kafka.dto.chat.MessageDto;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

	// template 정의
	private final SimpMessagingTemplate template;

	private static final Logger logger = LoggerFactory.getLogger(ChatController.class);


	@MessageMapping("/chat")
	public void greeting(MessageDto message,  @Header("simpSessionId") String sessionId) throws Exception {

//		String currentState = radioService.getCurrentState();
//		logger.debug("현재 상태 : {}", currentState);

//		logger.debug("접속자 수 : {}", userCounter.getCount());
		System.out.println(message + " ++ " + sessionId);
		template.convertAndSend("/topic", message); // 전체 전송
	}

}
