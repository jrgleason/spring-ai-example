package org.example.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("chat")
public class ChatController {
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final String PROMPT = "You are a pirate";//You are very empathetic and trying to help out a team member. You are a very advanced developer and people look up to you but can also feel dumb around you.";
    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    public ChatController(ChatClient.Builder builder, VectorStore vectorStore) {
        if (vectorStore == null) {
            throw new IllegalArgumentException("VectorStore is not initialized properly");
        }
        this.vectorStore = vectorStore;
        this.chatClient = builder
                .defaultAdvisors(new QuestionAnswerAdvisor(
                        vectorStore,
                        SearchRequest.defaults()
                ))
                .defaultSystem(PROMPT)
                .build();
    }

    @GetMapping("/")
    public ResponseEntity<String> question(
            @RequestParam(
                    value = "message",
                    defaultValue = "How to analyze time-series data with Python and MongoDB?"
            ) String message
    ) {
        logger.info("VectorStore state: {}", vectorStore.similaritySearch(SearchRequest.query(message).withTopK(5)));

        String responseContent = chatClient.prompt()
                .user(message)
                .call()
                .content();
        return ResponseEntity.ok(responseContent);
    }
}
