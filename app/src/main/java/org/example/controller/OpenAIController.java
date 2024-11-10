package org.example.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.image.*;
import org.springframework.ai.openai.api.OpenAiImageApi;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("openai")
public class OpenAIController {
    private final ChatClient chatClient;
    private final ImageModel imageModel;

    public OpenAIController(
            @Qualifier("buildClient") ChatClient chatClient,
            ImageModel imageModel) {
        this.chatClient = chatClient;
        this.imageModel = imageModel;
    }
    @GetMapping
    public ResponseEntity<String> question(
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

    @GetMapping("/image")
    public String generate(@RequestParam(value = "message") String message) {
        ImageOptions options = ImageOptionsBuilder.builder()
                .withModel(OpenAiImageApi.ImageModel.DALL_E_3.getValue())
                .withHeight(1024)
                .withWidth(1024)
                .build();

        ImagePrompt imagePrompt = new ImagePrompt(message, options);
        ImageResponse response = imageModel.call(imagePrompt);
        return response.getResult().getOutput().getUrl();
    }
}
