package org.example.config;

import org.springframework.ai.autoconfigure.chat.client.ChatClientBuilderConfigurer;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

@Configuration
public class SpringAIConfig {

    /**
     * Needed for the Image API there should be a way to accept the default #TODO
     */
    @Value("${spring.ai.openai.api-key}")
    private String openAiKey;

    @Bean
    @Scope("prototype")
    ChatClient.Builder openAiChatClientBuilder(
            ChatClientBuilderConfigurer configurer,
            @Qualifier("openAiChatModel") ChatModel chatModel) {
        return configurer.configure(
                ChatClient.builder(chatModel)
        );
    }


    @Bean
    public MessageChatMemoryAdvisor messageChatMemoryAdvisor() {
        return new MessageChatMemoryAdvisor(new InMemoryChatMemory());
    }
}
