package org.example.config.clients;

import org.example.advisors.SimpleLoggingAdvisor;
import org.example.service.ToggleFunction;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;

import java.util.function.Function;

@Configuration
public class OpenAIClientConfig extends BaseClientConfig {

    private final ChatClient.Builder openAiBuilder;
    private final VectorStore vectorStore;

    public OpenAIClientConfig(
            @Qualifier("openAiChatClientBuilder") ChatClient.Builder openAiBuilder,
            VectorStore vectorStore
    ) {
        this.openAiBuilder = openAiBuilder;
        this.vectorStore = vectorStore;
    }

    @Override
    protected ChatClient.Builder getBuilder() {
        return openAiBuilder;
    }

    @Bean(name = "openAiBuildClient")
    @Override
    public ChatClient buildClient(MessageChatMemoryAdvisor messageChatMemoryAdvisor) {
        return getBuilder()
                .defaultAdvisors(
                        messageChatMemoryAdvisor,
                        new QuestionAnswerAdvisor(vectorStore, SearchRequest.defaults()),
                        new SimpleLoggingAdvisor()
                )
                .defaultFunctions("toggleDevice")
                .defaultSystem(instructions)
                .defaultOptions(new OpenAiChatOptions())
                .build();
    }

    @Bean // function description
    @Description("Turn on/off or check the status, by not providing a value, of any device ")
    public Function<
            ToggleFunction.Request,
            ToggleFunction.Response
            > toggleDevice() {
        return new ToggleFunction();
    }
}