package org.example.service;

import org.example.controller.DeviceStateWebSocketHandler;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DeviceStateService {
    private final Map<String, Boolean> deviceStates = new HashMap<>();
    private final DeviceStateWebSocketHandler webSocketHandler;

    public DeviceStateService(DeviceStateWebSocketHandler webSocketHandler) {
        this.webSocketHandler = webSocketHandler;
    }

    public void setDeviceState(String device, Boolean state) {
        if (device == null || device.isEmpty()) {
            throw new IllegalArgumentException("Device name cannot be null or empty");
        }
        if (state != null) {
            deviceStates.put(device, state);
            webSocketHandler.sendMessage("Device " + device + " state changed to " + state);
        }
    }

    public Boolean getDeviceState(String device) {
        return deviceStates.getOrDefault(device, false);
    }

    public Map<String, Boolean> getAllDeviceStates() {
        return new HashMap<>(deviceStates);
    }
}