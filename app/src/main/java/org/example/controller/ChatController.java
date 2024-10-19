package org.example.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("chat")
public class ChatController {
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final ChatClient chatClient;

    public ChatController(ChatClient client) {

        this.chatClient = client;
    }

    @GetMapping("/")
    public ResponseEntity<String> question(
            @RequestParam(
                    value = "message",
                    defaultValue = "How to analyze time-series data with Python and MongoDB?"
            ) String message
    ) {
        String responseContent = chatClient.prompt( )
                .user(message)
                .call()
                .content();
        return ResponseEntity.ok(responseContent);
    }
}
