package org.example.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImageOptions;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.ai.openai.OpenAiAudioSpeechModel;
import org.springframework.ai.openai.OpenAiImageOptions;
import org.springframework.ai.openai.api.OpenAiImageApi;
import org.springframework.ai.openai.audio.speech.SpeechMessage;
import org.springframework.ai.openai.audio.speech.SpeechPrompt;
import org.springframework.ai.openai.audio.speech.SpeechResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("openai")
public class OpenAIController {
    private final ChatClient chatClient;
    private final ImageModel imageModel;
    private final OpenAiAudioSpeechModel speechModel;


    public OpenAIController(
            OpenAiAudioSpeechModel openAiAudioSpeechModel,
            @Qualifier("openAiBuildClient") ChatClient chatClient,
            ImageModel imageModel) {
        this.chatClient = chatClient;
        this.imageModel = imageModel;
        this.speechModel = openAiAudioSpeechModel;
    }

    @GetMapping
    public ResponseEntity<String> question(
            @RequestParam(
                    value = "message",
                    defaultValue = "How to analyze time-series data with Python and MongoDB?"
            ) String message
    ) {
        String responseContent = chatClient.prompt()
                .user(message)
                .call()
                .content();
        return ResponseEntity.ok(responseContent);
    }

    @GetMapping("/stream")
    public Flux<String> chatWithStream(@RequestParam String message) {
        return chatClient.prompt()
                .user(message)
                .stream()
                .content();
    }

    @GetMapping(value = "/audio", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<StreamingResponseBody> streamAudio(
            @RequestParam(value = "message", defaultValue = "Today is a wonderful day!") String message) {

        StreamingResponseBody responseBody = outputStream -> {
            SpeechPrompt speechPrompt = new SpeechPrompt(new SpeechMessage(message));
            SpeechResponse response = speechModel.call(speechPrompt);
            outputStream.write(response.getResult().getOutput());
            outputStream.flush();
        };

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("audio/mp3"))
                .body(responseBody);
    }

    @GetMapping("/image")
    public String generate(@RequestParam(value = "message") String message) {
        ImageOptions options = OpenAiImageOptions.builder()
                .quality("hd")
                .N(4)
                .model(OpenAiImageApi.ImageModel.DALL_E_3.getValue())
                .height(1024)
                .width(1024).build();

        ImagePrompt imagePrompt = new ImagePrompt(message, options);
        ImageResponse response = imageModel.call(imagePrompt);
        return response.getResult().getOutput().getUrl();
    }
}
