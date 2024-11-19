package org.example.config.clients;

import org.springframework.ai.anthropic.AnthropicChatOptions;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AnthropicClientConfig extends BaseClientConfig {

    private final ChatClient.Builder anthropicBuilder;

    public AnthropicClientConfig(@Qualifier("anthropicChatClientBuilder") ChatClient.Builder anthropicBuilder) {
        this.anthropicBuilder = anthropicBuilder;
    }

    @Override
    protected ChatClient.Builder getBuilder() {
        return anthropicBuilder;
    }

    @Bean(name = "anthropicBuildClient")
    @Override
    public ChatClient buildClient(MessageChatMemoryAdvisor messageChatMemoryAdvisor) {
        return getBuilder()
                .defaultAdvisors(messageChatMemoryAdvisor)
                .defaultSystem(instructions)
                .defaultOptions(new AnthropicChatOptions())
                .build();
    }
}