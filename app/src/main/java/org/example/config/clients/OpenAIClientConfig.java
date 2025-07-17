package org.example.config.clients;

import org.example.advisors.SimpleLoggingAdvisor;
import org.example.service.DeviceStateService;
import org.example.service.ToggleFunction;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;

import java.util.function.Function;

@Configuration
public class OpenAIClientConfig extends BaseClientConfig {

    private final DeviceStateService deviceStateService;

    public OpenAIClientConfig(
            DeviceStateService deviceStateService
    ) {
        this.deviceStateService = deviceStateService;
    }

    @Bean(name = "openAiBuildClient")
    public ChatClient buildClient(
            @Qualifier("openAiChatClientBuilder") ChatClient.Builder openAiBuilder,
            MessageChatMemoryAdvisor messageChatMemoryAdvisor,
            @Qualifier("vectorStore") VectorStore pineconeVectorStore
    ) {
        return openAiBuilder
                .defaultAdvisors(
                        messageChatMemoryAdvisor,
                        new QuestionAnswerAdvisor(pineconeVectorStore),
                        new SimpleLoggingAdvisor()
                )
                .defaultTools("toggleDevice")
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
        return new ToggleFunction(deviceStateService);
    }
}