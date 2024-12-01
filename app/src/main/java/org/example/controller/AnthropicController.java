package org.example.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("anthropic")
public class AnthropicController {
    private final ChatClient chatClient;

    public AnthropicController(
            @Qualifier("anthropicBuildClient") ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    @GetMapping("/anthropic")
    public ResponseEntity<String> questionAnthropic(
            @RequestParam(
                    value = "message",
                    defaultValue = "How to analyze time-series data with Python and MongoDB?"
            ) String message
    ) {
        String responseContent = chatClient.prompt()
                                           .user(message)
                                           .call()
                                           .content();
        return ResponseEntity.ok(responseContent);
    }
}
