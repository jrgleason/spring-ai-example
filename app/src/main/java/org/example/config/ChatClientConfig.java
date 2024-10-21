package org.example.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.Data;
import org.example.service.SmartHomeVector;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
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
            VectorStore vectorStore,
            SmartHomeVector smartHomeVector
    ) throws JsonProcessingException, InterruptedException {
        smartHomeVector.updateSmartHomeVectors();
        if (vectorStore == null) {
            throw new IllegalArgumentException("VectorStore is not initialized properly");
        }
        return builder
                .defaultAdvisors(
                        // To remember the convo
                        new MessageChatMemoryAdvisor(new InMemoryChatMemory()),
                        // To add stuff from the Vector Store
                        new QuestionAnswerAdvisor(
                                vectorStore,
                                SearchRequest.defaults()
                        )
                )
                .defaultSystem(instructions)
                .defaultOptions(new OpenAiChatOptions())
                .build();
    }
}