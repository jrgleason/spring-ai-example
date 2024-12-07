package org.example.config.clients;

import org.springframework.ai.anthropic.AnthropicChatOptions;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AnthropicClientConfig extends BaseClientConfig {
    @Bean(name = "anthropicBuildClient")
    public ChatClient buildClient(
            @Qualifier("anthropicChatClientBuilder") ChatClient.Builder anthropicBuilder,
            MessageChatMemoryAdvisor messageChatMemoryAdvisor
    ) {
        return anthropicBuilder
                .defaultAdvisors(messageChatMemoryAdvisor)
                .defaultSystem(instructions)
                .defaultOptions(new AnthropicChatOptions())
                .build();
    }
}