package org.example.config;

import org.example.controller.DeviceStateWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final DeviceStateWebSocketHandler deviceStateWebSocketHandler;

    public WebSocketConfig(DeviceStateWebSocketHandler deviceStateWebSocketHandler) {
        this.deviceStateWebSocketHandler = deviceStateWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(deviceStateWebSocketHandler, "/ws/devices").setAllowedOrigins("*");
    }
}