package org.example.vectorstore;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.TokenCountBatchingStrategy;
import org.springframework.ai.vectorstore.redis.RedisVectorStore;
import org.springframework.ai.vectorstore.redis.RedisVectorStore.MetadataField;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import redis.clients.jedis.JedisPooled;


// TODO: add conditional
@Configuration
@Profile("redis")
public class CustomRedisVectorStoreConfig {
    @Value("${spring.data.redis.host}")
    private String redisHost;
    @Value("${spring.data.redis.port}")
    private int redisPort;

    @Bean
    public JedisPooled jedisPooled() {
        return new JedisPooled(
                redisHost,
                redisPort
        );
    }

    @Bean(name = "customRedisVectorStore")
    public RedisVectorStore redisVectorStore(EmbeddingModel embeddingModel,
                                             JedisPooled jedisPooled) {

        return RedisVectorStore.builder(jedisPooled, embeddingModel)
                .indexName("spring-ai-example")
                .prefix("jrg")
                .metadataFields(
                        MetadataField.text("original_answer"),
                        MetadataField.text("original_question"),
                        MetadataField.tag("type"))
                .initializeSchema(true)
                .batchingStrategy(new TokenCountBatchingStrategy())
                .build();
    }
}
