package org.example.config;

import lombok.Data;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
public class ChatClientConfig {

    @Value("${app.bot.instructions}")
    private String instructions;

    @Value("${app.bot.name}")
    private String name;

    @Value("${app.bot.model}")
    private String model;

    @Bean
    public ChatClient buildClient(
            ChatClient.Builder builder,
            VectorStore vectorStore
    ) {
        if (vectorStore == null) {
            throw new IllegalArgumentException("VectorStore is not initialized properly");
        }
        return builder
                .defaultAdvisors(new QuestionAnswerAdvisor(
                        vectorStore,
                        SearchRequest.defaults()
                ))
                .defaultSystem(instructions)
                .defaultOptions(new OpenAiChatOptions())
                .build();
    }
}