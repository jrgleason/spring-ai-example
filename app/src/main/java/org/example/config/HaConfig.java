package org.example.config;

import jakarta.annotation.PostConstruct;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class HaConfig {

    private static final Logger logger = LoggerFactory.getLogger(HaConfig.class);

    @Value("${mqtt.server.uri}")
    private String serverUri;

    @Value("${mqtt.client-id}")
    private String clientId;

    @Value("${mqtt.username}")
    private String username;

    @Value("${mqtt.password}")
    private String password;

    @Value("${mqtt.completion-timeout}")
    private int completionTimeout;

//    @Value("${mqtt.topics}")
    private String[] topics = {"zwave"};

    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        logger.info("Creating the Mqtt Factory");
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[] {serverUri});
        options.setUserName(username);
        options.setPassword(password.toCharArray());
        factory.setConnectionOptions(options);
        return factory;
    }

    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    @Bean
    public MessageProducer inbound() {
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter(clientId, mqttClientFactory(),
                        getTopicsWithWildcard(topics));
        adapter.setCompletionTimeout(completionTimeout);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }

    private String[] getTopicsWithWildcard(String[] topics) {
        return java.util.Arrays.stream(topics)
                .map(topic -> topic + "/#")
                .toArray(String[]::new);
    }

    @Bean
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public MessageHandler handler() {
        return message -> {
            String topic = message.getHeaders().get("mqtt_receivedTopic").toString();
            String payload = message.getPayload().toString();
            logger.info("Received message from topic {}: {}", topic, payload);
        };
    }
    @PostConstruct
    public void logConfig() {
        logger.info(
                "HaConfig initialized with serverUri: {}, clientId: {}, topics: {}",
                serverUri,
                clientId,
                String.join(", ", topics)
        );
    }
}
