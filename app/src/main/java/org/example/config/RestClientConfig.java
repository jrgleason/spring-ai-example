package org.example.config;

import org.springframework.boot.web.client.RestClientCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;

import java.time.Duration;

@Configuration
public class RestClientConfig {

    /**
     * RestClient needs configured to allow for longer image requests.
     *
     * @return
     */
    @Bean
    RestClientCustomizer restClientCustomizer() {
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout((int) Duration.ofSeconds(60).toMillis());
        factory.setReadTimeout((int) Duration.ofSeconds(120).toMillis());

        return restClientBuilder -> restClientBuilder.requestFactory(new BufferingClientHttpRequestFactory(factory));
    }
}