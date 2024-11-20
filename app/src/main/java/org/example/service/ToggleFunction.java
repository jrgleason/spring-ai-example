package org.example.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public class ToggleFunction implements Function<ToggleFunction.Request, ToggleFunction.Response> {
    private static final Logger logger = LoggerFactory.getLogger(ToggleFunction.class);

    private final Map<String, Boolean> deviceStates = new HashMap<>();

    public record Request(Boolean value, String device) {}
    public record Response(boolean state) {}

    public Response apply(Request request) {
        String device = request.device();
        Boolean value = request.value();

        if (device == null || device.isEmpty()) {
            throw new IllegalArgumentException("Device name cannot be null or empty");
        }

        if (value != null) {
            deviceStates.put(device, value);
        }

        return new Response(deviceStates.getOrDefault(device, false));
    }
}