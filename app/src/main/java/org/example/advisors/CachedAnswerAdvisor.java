package org.example.advisors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.advisor.api.*;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.util.Assert;
import reactor.core.publisher.Flux;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Advisor that checks a vector store for similar previous questions and returns
 * cached answers if similarity threshold is met, avoiding unnecessary AI calls.
 * The similarity search is performed only on the question part, not the answer.
 */
public class CachedAnswerAdvisor implements CallAroundAdvisor, StreamAroundAdvisor {

    public static final String CACHE_HIT = "cache_hit";
    public static final String SIMILARITY_SCORE = "similarity_score";
    public static final String ORIGINAL_QUESTION = "original_question";
    private static final double DEFAULT_SIMILARITY_THRESHOLD = 0.95;
    private static final int DEFAULT_ORDER = 0;
    private final Logger logger = LoggerFactory.getLogger(CachedAnswerAdvisor.class);
    private final VectorStore vectorStore;
    private final double similarityThreshold;
    private final int order;

    public CachedAnswerAdvisor(VectorStore vectorStore) {
        this(vectorStore, DEFAULT_SIMILARITY_THRESHOLD, DEFAULT_ORDER);
    }

    public CachedAnswerAdvisor(VectorStore vectorStore, double similarityThreshold, int order) {
        Assert.notNull(vectorStore, "VectorStore must not be null!");
        Assert.isTrue(similarityThreshold > 0 && similarityThreshold <= 1.0,
                "Similarity threshold must be between 0 and 1");

        this.vectorStore = vectorStore;
        this.similarityThreshold = similarityThreshold;
        this.order = order;
    }

    public static Builder builder(VectorStore vectorStore) {
        return new Builder(vectorStore);
    }

    @Override
    public String getName() {
        return this.getClass().getSimpleName();
    }

    @Override
    public int getOrder() {
        return this.order;
    }

    @Override
    public AdvisedResponse aroundCall(AdvisedRequest advisedRequest, CallAroundAdvisorChain chain) {
        // Check cache first
        Document bestMatch = findBestMatch(advisedRequest.userText());

        if (bestMatch != null && isSimilarEnough(bestMatch)) {
            return createCachedResponse(bestMatch, advisedRequest);
        }

        // If no good cache match, get response from chain and cache it
        AdvisedResponse response = chain.nextAroundCall(advisedRequest);
        Generation result = response.response().getResult();
        if (result != null) {
            cacheResponse(advisedRequest.userText(), result.getOutput().getContent());
        }
        return response;
    }

    @Override
    public Flux<AdvisedResponse> aroundStream(AdvisedRequest advisedRequest, StreamAroundAdvisorChain chain) {
        // Check cache first
        Document bestMatch = findBestMatch(advisedRequest.userText());

        if (bestMatch != null && isSimilarEnough(bestMatch)) {
            return Flux.just(createCachedResponse(bestMatch, advisedRequest));
        }

        // Collect the responses and build complete content
        StringBuilder completeResponse = new StringBuilder();
        return chain.nextAroundStream(advisedRequest)
                    .doOnNext(response -> {
                        // Append each chunk of the response
                        Generation result = response.response().getResult();
                        if (result != null) {
                            completeResponse.append(result.getOutput().getContent());
                        }
                    })
                    .doOnComplete(() -> {
                        // Cache the complete response
                        if (!completeResponse.isEmpty()) {
                            cacheResponse(advisedRequest.userText(), completeResponse.toString());
                        }
                    });
    }

    private Document findBestMatch(String query) {
        SearchRequest searchRequest = SearchRequest.query(query).withTopK(1);
        List<Document> results = vectorStore.similaritySearch(searchRequest);

        if (!results.isEmpty()) {
            Document match = results.getFirst();
            logger.debug("Query: {}", query);
            logger.debug("Best match content: {}", match.getContent());
            logger.debug("Best match metadata: {}", match.getMetadata());
            logger.debug("Vector score: {}", match.getMetadata().get("vector_score"));
        }

        return results.isEmpty() ? null : results.getFirst();
    }

    private boolean isSimilarEnough(Document match) {
        Object scoreObj = match.getMetadata().get("vector_score");
        if (scoreObj == null) {
            return false;
        }
        double distance;
        if (scoreObj instanceof Number) {
            distance = ((Number) scoreObj).doubleValue();
        } else {
            try {
                distance = Double.parseDouble(scoreObj.toString());
            } catch (NumberFormatException e) {
                return false;
            }
        }
        // Redis returns cosine distance where:
        // 0.0 means identical vectors (most similar)
        // 2.0 means opposite vectors (least similar)
        // We need to convert this to a similarity score between 0 and 1
        double similarity = 1.0 - (distance / 2.0);
        return similarity >= similarityThreshold;
    }

    private AdvisedResponse createCachedResponse(Document match, AdvisedRequest request) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put(CACHE_HIT, true);
        metadata.put(SIMILARITY_SCORE, match.getMetadata().get("vector_score"));
        metadata.put(ORIGINAL_QUESTION, match.getMetadata().get("original_question"));

        // Extract answer from content if metadata is not available
        String originalAnswer;
        if (match.getMetadata().containsKey("original_answer")) {
            originalAnswer = (String) match.getMetadata().get("original_answer");
        } else {
            // Parse from content assuming old format
            String content = match.getContent();
            int answerStart = content.indexOf("Answer: ");
            if (answerStart != -1) {
                originalAnswer = content.substring(answerStart + 8);
            } else {
                originalAnswer = content;
            }
        }
        ChatResponse response = ChatResponse.builder()
                                            .withGenerations(List.of(new Generation(new AssistantMessage(originalAnswer))))
                                            .build();

        return new AdvisedResponse(response, request.adviseContext());
    }

    /**
     * Cleans up old format entries in the cache.
     * Call this method if you have old format entries in your Redis store.
     */
    public void cleanupOldFormatEntries() {
        SearchRequest searchRequest = SearchRequest.query("Question:").withTopK(100);
        List<Document> oldDocs = vectorStore.similaritySearch(searchRequest);

        for (Document doc : oldDocs) {
            String content = doc.getContent();
            if (content.startsWith("Question: ")) {
                int answerStart = content.indexOf("Answer: ");
                if (answerStart != -1) {
                    String question = content.substring(9, answerStart).trim();
                    String answer = content.substring(answerStart + 8).trim();
                    // Re-cache in new format
                    cacheResponse(question, answer);
                    // TODO: Add method to delete old document if your VectorStore implementation supports it
                }
            }
        }
    }

    /**
     * Adds a new question-answer pair to the cache.
     * Only the question is used for embedding and similarity search,
     * while the answer is stored in metadata.
     */
    public void cacheResponse(String question, String answer) {
        // Create metadata map with all fields we want to store
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("$.original_question", question);  // Using JSON path notation
        metadata.put("$.original_answer", answer);
        metadata.put("$.type", "cached_response");

        logger.debug("Creating document with metadata: {}", metadata);

        // Create document with question as content and metadata
        Document doc = new Document(question, metadata);
        logger.debug("Created document: {}", doc);

        vectorStore.add(List.of(doc));
    }

    public static class Builder {
        private final VectorStore vectorStore;
        private double similarityThreshold = DEFAULT_SIMILARITY_THRESHOLD;
        private int order = DEFAULT_ORDER;

        private Builder(VectorStore vectorStore) {
            this.vectorStore = vectorStore;
        }

        public Builder withSimilarityThreshold(double threshold) {
            this.similarityThreshold = threshold;
            return this;
        }

        public Builder withOrder(int order) {
            this.order = order;
            return this;
        }

        public CachedAnswerAdvisor build() {
            return new CachedAnswerAdvisor(this.vectorStore, this.similarityThreshold, this.order);
        }
    }
}