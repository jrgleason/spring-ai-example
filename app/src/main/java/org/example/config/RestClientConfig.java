package org.example.config;

import org.springframework.boot.web.client.ClientHttpRequestFactories;
import org.springframework.boot.web.client.ClientHttpRequestFactorySettings;
import org.springframework.boot.web.client.RestClientCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.BufferingClientHttpRequestFactory;

import java.time.Duration;

@Configuration
public class RestClientConfig {

    /**
     * RestClient needs configured to allow for longer image requests.
     * @return
     */
    @Bean
    RestClientCustomizer restClientCustomizer() {
        return restClientBuilder -> {
            restClientBuilder
                    .requestFactory(new BufferingClientHttpRequestFactory(
                            ClientHttpRequestFactories.get(ClientHttpRequestFactorySettings.DEFAULTS
                                    .withConnectTimeout(Duration.ofSeconds(60))
                                    .withReadTimeout(Duration.ofSeconds(120))
                            )));
        };
    }
}