package org.example.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
public class ModelConfig {
    @Value("${app.bot.instructions}")
    private String instructions;
    @Value("${app.bot.name}")
    private String name;
    @Value("${app.bot.model}")
    private String model;

//    @Bean
//    public ChatClient buildClient(
//            ChatClient.Builder builder,
//            VectorStore vectorStore
//    ) {
//        return builder
//                .defaultAdvisors(new QuestionAnswerAdvisor(
//                        vectorStore,
//                        SearchRequest.defaults()
//                ))
//                .defaultOptions(new OpenAiChatOptions())
//                .prompt(instructions)
//                .name(name)
//                .tool("code_interpreter") // Assuming you want to set the tool as "code_interpreter"
//                .model(model)
//                .build();
//    }
}
