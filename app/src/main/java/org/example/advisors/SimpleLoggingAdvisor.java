package org.example.advisors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.advisor.api.*;
import org.springframework.ai.chat.model.MessageAggregator;
import reactor.core.publisher.Flux;

public class SimpleLoggingAdvisor implements CallAroundAdvisor, StreamAroundAdvisor {
    private static final Logger logger = LoggerFactory.getLogger(SimpleLoggingAdvisor.class);

    public SimpleLoggingAdvisor() {
        logger.debug("TestAdvisor created");
    }

    @Override
    public String getName() {
        return this.getClass().getSimpleName();
    }

    @Override
    public int getOrder() {
        return 0;
    }

    @Override
    public AdvisedResponse aroundCall(AdvisedRequest advisedRequest, CallAroundAdvisorChain chain) {

        logger.debug("BEFORE: {}", advisedRequest);

        AdvisedResponse advisedResponse = chain.nextAroundCall(advisedRequest);

        logger.debug("AFTER: {}", advisedResponse);

        return advisedResponse;
    }

    @Override
    public Flux<AdvisedResponse> aroundStream(AdvisedRequest advisedRequest, StreamAroundAdvisorChain chain) {
        logger.debug("BEFORE: {}", advisedRequest);

        Flux<AdvisedResponse> advisedResponses = chain.nextAroundStream(advisedRequest);

        return new MessageAggregator().aggregateAdvisedResponse(advisedResponses,
                advisedResponse -> logger.debug("AFTER: {}", advisedResponse));
    }
}
