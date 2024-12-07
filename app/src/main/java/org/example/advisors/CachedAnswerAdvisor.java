package org.example.advisors;

import org.springframework.ai.chat.client.advisor.api.*;
import org.springframework.ai.chat.messages.UserMessage;
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
 */
public class CachedAnswerAdvisor implements CallAroundAdvisor, StreamAroundAdvisor {

    private static final double DEFAULT_SIMILARITY_THRESHOLD = 0.95;
    private static final int DEFAULT_ORDER = 0;

    private final VectorStore vectorStore;
    private final double similarityThreshold;
    private final int order;

    public static final String CACHE_HIT = "cache_hit";
    public static final String SIMILARITY_SCORE = "similarity_score";
    public static final String ORIGINAL_QUESTION = "original_question";

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
        return results.isEmpty() ? null : results.getFirst();
    }

    private boolean isSimilarEnough(Document match) {
        Object scoreObj = match.getMetadata().get("score");
        if (scoreObj == null) {
            return false;
        }
        double score;
        if (scoreObj instanceof Number) {
            score = ((Number) scoreObj).doubleValue();
        } else {
            try {
                score = Double.parseDouble(scoreObj.toString());
            } catch (NumberFormatException e) {
                return false;
            }
        }
        return score >= similarityThreshold;
    }

    private AdvisedResponse createCachedResponse(Document match, AdvisedRequest request) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put(CACHE_HIT, true);
        metadata.put(SIMILARITY_SCORE, match.getMetadata().get("score"));
        metadata.put(ORIGINAL_QUESTION, match.getMetadata().get("original_question"));

        UserMessage responseMessage = new UserMessage(match.getContent());
        ChatResponse response = ChatResponse.builder()
                .withGenerations(List.of(new Generation(new AssistantMessage(match.getContent()))))
                .build();

        return new AdvisedResponse(response, request.adviseContext());
    }

    /**
     * Adds a new question-answer pair to the cache
     */
    public void cacheResponse(String question, String answer) {
        // Store both question and answer in content for embedding
        String combinedContent = String.format("Question: %s\nAnswer: %s", question, answer);

        Document doc = new Document(combinedContent, Map.of(
                "original_question", question,
                "original_answer", answer,
                "type", "cached_response"
        ));
        vectorStore.add(List.of(doc));
    }

    public static Builder builder(VectorStore vectorStore) {
        return new Builder(vectorStore);
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