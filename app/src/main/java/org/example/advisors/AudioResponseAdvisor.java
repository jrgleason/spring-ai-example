package org.example.advisors;
import org.springframework.ai.chat.client.advisor.api.AdvisedRequest;
import org.springframework.ai.chat.client.advisor.api.AdvisedResponse;
import org.springframework.ai.chat.client.advisor.api.CallAroundAdvisor;
import org.springframework.ai.chat.client.advisor.api.CallAroundAdvisorChain;
import org.springframework.ai.chat.client.advisor.api.StreamAroundAdvisor;
import org.springframework.ai.chat.client.advisor.api.StreamAroundAdvisorChain;
import org.springframework.ai.openai.audio.speech.SpeechMessage;
import org.springframework.ai.openai.audio.speech.SpeechModel;
import org.springframework.ai.openai.audio.speech.SpeechPrompt;
import org.springframework.ai.openai.audio.speech.SpeechResponse;
import reactor.core.publisher.Flux;

public class AudioResponseAdvisor implements CallAroundAdvisor, StreamAroundAdvisor {

    private final SpeechModel speechModel;

    public AudioResponseAdvisor(SpeechModel speechModel) {
        this.speechModel = speechModel;
    }

    @Override
    public String getName() {
        return "AudioResponseAdvisor";
    }

    @Override
    public int getOrder() {
        return LOWEST_PRECEDENCE;
    }

    @Override
    public AdvisedResponse aroundCall(AdvisedRequest advisedRequest, CallAroundAdvisorChain chain) {
        AdvisedResponse textResponse = chain.nextAroundCall(advisedRequest);

        String responseText = textResponse.response()
                .getResult()
                .getOutput()
                .getContent();

        SpeechPrompt speechPrompt = new SpeechPrompt(new SpeechMessage(responseText));
        SpeechResponse response = speechModel.call(speechPrompt);

        return textResponse.updateContext(context -> {
            context.put("audioData", response.getResult().getOutput());
            return context;
        });
    }

    @Override
    public Flux<AdvisedResponse> aroundStream(AdvisedRequest advisedRequest, StreamAroundAdvisorChain chain) {
        return chain.nextAroundStream(advisedRequest)
                .map(response -> {
                    String responseText = response.response()
                            .getResult()
                            .getOutput()
                            .getContent();

                    SpeechPrompt speechPrompt = new SpeechPrompt(new SpeechMessage(responseText));
                    SpeechResponse audioResponse = speechModel.call(speechPrompt);

                    return response.updateContext(context -> {
                        context.put("audioData", audioResponse.getResult().getOutput());
                        return context;
                    });
                });
    }
}