package org.example.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
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

    public ChatController(
            @Qualifier("buildClient") ChatClient client,
            @Qualifier("buildAnthropicClient") ChatClient anthropicClient,
            VectorStore vectorStore ) {
        this.chatClient = client;
        this.anthropicChatClient = anthropicClient;
        this.vectorStore = vectorStore;
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
