package org.example.config;

import org.springframework.ai.autoconfigure.chat.client.ChatClientBuilderConfigurer;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.document.MetadataMode;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.openai.OpenAiEmbeddingModel;
import org.springframework.ai.openai.OpenAiEmbeddingOptions;
import org.springframework.ai.openai.api.OpenAiApi;
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
    // TODO: This should be an Ordinal or at least a static in the Spring AI framework. I might be missing something
    private static final String EMBEDDING_MODEL = "text-embedding-3-large";

    @Bean
    @Scope("prototype")
    ChatClient.Builder openAiChatClientBuilder(
            ChatClientBuilderConfigurer chatClientBuilderConfigurer,
            @Qualifier("openAiChatModel") ChatModel chatModel
    ) {
        ChatClient.Builder builder = ChatClient.builder(chatModel);
        return chatClientBuilderConfigurer.configure(builder);
    }

    @Bean
    @Scope("prototype")
    ChatClient.Builder anthropicChatClientBuilder(
            ChatClientBuilderConfigurer chatClientBuilderConfigurer,
            @Qualifier("anthropicChatModel") ChatModel chatModel
    ) {
        ChatClient.Builder builder = ChatClient.builder(chatModel);
        return chatClientBuilderConfigurer.configure(builder);
    }

    @Bean
    public MessageChatMemoryAdvisor messageChatMemoryAdvisor() {
        return new MessageChatMemoryAdvisor(new InMemoryChatMemory());
    }

    @Bean
    public EmbeddingModel embeddingModel() {
        return new OpenAiEmbeddingModel(
                new OpenAiApi(openAiKey),
                MetadataMode.EMBED,
                OpenAiEmbeddingOptions.builder()
                        .withModel(EMBEDDING_MODEL)
                        .build()
        );
    }
}
