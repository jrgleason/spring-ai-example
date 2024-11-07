package org.example.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.image.*;
import org.springframework.ai.openai.OpenAiImageOptions;
import org.springframework.ai.openai.api.OpenAiImageApi;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("chat")
public class ChatController {
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final ChatClient chatClient;
    private final ChatClient anthropicChatClient;
    private final VectorStore vectorStore;
    private final ImageModel imageModel;

    public ChatController(
            @Qualifier("buildClient") ChatClient client,
            @Qualifier("buildAnthropicClient") ChatClient anthropicClient,
            VectorStore vectorStore,
            ImageModel imageClient, ImageModel imageModel) {
        this.chatClient = client;
        this.anthropicChatClient = anthropicClient;
        this.vectorStore = vectorStore;
        this.imageModel = imageModel;
    }


    @GetMapping("/openai")
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

    @GetMapping("/openai/image")
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


    @GetMapping("/anthropic")
    public ResponseEntity<String> questionAnthropic(
            @RequestParam(
                    value = "message",
                    defaultValue = "How to analyze time-series data with Python and MongoDB?"
            ) String message
    ) {
        String responseContent = anthropicChatClient.prompt()
                .user(message)
                .call()
                .content();
        return ResponseEntity.ok(responseContent);
    }

    @GetMapping("/search")
    public List<Map<String, Object>> searchDocuments() {

        // Retrieve documents similar to a query
        List<Document> results = this.vectorStore.similaritySearch(SearchRequest.query("Smart Home").withTopK(5));

        return results.stream().map(doc -> Map.of(
                "content", doc.getContent(),
                "metadata", doc.getMetadata()
        )).collect(Collectors.toList());
    }

    @GetMapping("/")
    public ResponseEntity<Void> rootEndpoint() {
        return ResponseEntity.ok().build();
    }
}
