package org.example.vectorstore;

import io.micrometer.observation.ObservationRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.embedding.BatchingStrategy;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.RedisVectorStore;
import org.springframework.ai.vectorstore.observation.VectorStoreObservationConvention;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import redis.clients.jedis.JedisPooled;

import java.util.List;


// TODO: add conditional
@Configuration
public class CustomRedisVectorStoreConfig {
    private static final Logger logger = LoggerFactory.getLogger(CustomRedisVectorStoreConfig.class);

    @Bean
    public JedisConnectionFactory redisConnectionFactory() {
        return new JedisConnectionFactory();
    }

    @Bean
    public RedisTemplate<String, Message> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Message> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        return template;
    }

    @Bean(name = "customRedisVectorStore")
    public RedisVectorStore redisVectorStore(EmbeddingModel embeddingModel, JedisConnectionFactory jedisConnectionFactory,
                                             ObjectProvider<ObservationRegistry> observationRegistry,
                                             ObjectProvider<VectorStoreObservationConvention> customObservationConvention,
                                             BatchingStrategy batchingStrategy) {
        // Define the metadata fields we want Redis to index and return
        // Use plain names because RedisVectorStore will add the $. prefix internally
        List<RedisVectorStore.MetadataField> metadataFields = List.of(
                RedisVectorStore.MetadataField.text("original_answer"),
                RedisVectorStore.MetadataField.text("original_question"),
                RedisVectorStore.MetadataField.tag("type")
        );

        logger.debug("Configuring Redis vector store with metadata fields: {}", metadataFields);

        var config = RedisVectorStore.RedisVectorStoreConfig.builder()
                                                            .withIndexName("spring-ai-example")
                                                            .withPrefix("prefix")
                                                            .withMetadataFields(metadataFields)
                                                            .build();

        logger.debug("Created Redis vector store config: {}", config);

        return new RedisVectorStore(config, embeddingModel,
                new JedisPooled(jedisConnectionFactory.getHostName(), jedisConnectionFactory.getPort()),
                true, observationRegistry.getIfUnique(() -> ObservationRegistry.NOOP),
                customObservationConvention.getIfAvailable(() -> null), batchingStrategy);
    }
}
