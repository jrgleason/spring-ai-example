package org.example.config.clients;

import org.example.advisors.AudioResponseAdvisor;
import org.example.advisors.SimpleLoggingAdvisor;
import org.example.service.MyFunctionService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.audio.speech.SpeechModel;
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
    private final AudioResponseAdvisor audioResponseAdvisor;

    public OpenAIClientConfig(
            @Qualifier("openAiChatClientBuilder") ChatClient.Builder openAiBuilder,
            VectorStore vectorStore,
            SpeechModel speechModel
    ) {
        this.openAiBuilder = openAiBuilder;
        this.vectorStore = vectorStore;
        this.audioResponseAdvisor = new AudioResponseAdvisor(speechModel);
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
                .defaultFunctions("testFunction")
                .defaultSystem(instructions)
                .defaultOptions(new OpenAiChatOptions())
                .build();
    }
    @Bean
    @Description("Try the test function") // function description
    public Function<
            MyFunctionService.Request,
            MyFunctionService.Response
            > testFunction() {
        return new MyFunctionService();
    }
    @Bean
    public AudioResponseAdvisor audioResponseAdvisor() {
        return audioResponseAdvisor;
    }
}