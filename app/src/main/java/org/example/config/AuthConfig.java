package org.example.config;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.openai.OpenAiEmbeddingModel;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.ai.vectorstore.MongoDBAtlasVectorStore;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class AuthConfig {
    @Value("${spring.ai.openai.api-key}")
    private String openAiKey;

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http
    ) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests((authz) -> authz
                        .anyRequest().permitAll()
                );
        return http.build();
    }

    @Bean
    public EmbeddingModel embeddingModel() {
        return new OpenAiEmbeddingModel(
                new OpenAiApi(openAiKey)
        );
    }

    @Bean
    public VectorStore mongodbVectorStore(
            MongoTemplate mongoTemplate,
            EmbeddingModel embeddingModel
    ) {
        return new MongoDBAtlasVectorStore(
                mongoTemplate,
                embeddingModel,
                MongoDBAtlasVectorStore
                        .MongoDBVectorStoreConfig
                        .builder()
                        .build(),
                true);
    }
}