package org.example.config.clients;

import lombok.Data;
import org.example.config.SpringAIConfig;
import org.springframework.ai.anthropic.AnthropicChatOptions;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Data
@Configuration
@Import({SpringAIConfig.class})
public class AnthropicClientConfig {
    @Value("${app.bot.instructions}")
    private String instructions;

    @Bean
    public ChatClient buildAnthropicClient(
            @Qualifier("anthropicChatClientBuilder") ChatClient.Builder builder,
            MessageChatMemoryAdvisor messageChatMemoryAdvisor
    ) {
        return builder
                .defaultAdvisors(
                        messageChatMemoryAdvisor
                )
                .defaultSystem(instructions)
                .defaultOptions(new AnthropicChatOptions())
                .build();
    }
}
