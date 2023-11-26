package com.b302.zizon.util.gpt.controller;

import com.b302.zizon.util.gpt.dto.ChatGptResponse;
import com.b302.zizon.util.gpt.dto.QuestionRequest;
import com.b302.zizon.util.gpt.service.ChatGptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Locale;

@RequiredArgsConstructor
@RequestMapping("/chat-gpt")
@RestController
public class ChatGptController {

    private final ChatGptService chatGptService;

    @PostMapping("/question")
    public ResponseEntity sendQuestion(
            Locale locale,
            HttpServletRequest request,
            HttpServletResponse response,
            @RequestBody QuestionRequest questionRequest) {
        ChatGptResponse chatGptResponse = null;
        try {
            chatGptResponse = chatGptService.askQuestion(questionRequest);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        //return 부분은 자유롭게 수정하시면됩니다. ex)return chatGptResponse;
        return ResponseEntity.ok().body(chatGptResponse);
    }
}