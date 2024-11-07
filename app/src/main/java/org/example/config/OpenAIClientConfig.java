package org.example.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.Data;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Data
@Configuration
@Import({SpringAIConfig.class})
public class OpenAIClientConfig {

    private final ChatClient.Builder openAiBuilder;
    private final VectorStore vectorStore;
    @Value("${app.bot.instructions}")
    private String instructions;
    @Value("${app.bot.name}")
    private String name;
    @Value("${app.bot.model}")
    private String model;

    public OpenAIClientConfig(
            @Qualifier("openAiChatClientBuilder") ChatClient.Builder openAiBuilder,
            VectorStore vectorStore
    ) {
        this.openAiBuilder = openAiBuilder;
        this.vectorStore = vectorStore;
    }

    @Bean
    public ChatClient buildClient(
            MessageChatMemoryAdvisor messageChatMemoryAdvisor
    ) throws JsonProcessingException, InterruptedException {
        return openAiBuilder
                .defaultAdvisors(
                        messageChatMemoryAdvisor,
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