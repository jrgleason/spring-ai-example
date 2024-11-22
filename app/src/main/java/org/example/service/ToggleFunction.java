package org.example.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.function.Function;

public class ToggleFunction implements Function<ToggleFunction.Request, ToggleFunction.Response> {
    private static final Logger logger = LoggerFactory.getLogger(ToggleFunction.class);

    private final DeviceStateService deviceStateService;

    public ToggleFunction(DeviceStateService deviceStateService) {
        this.deviceStateService = deviceStateService;
    }

    public Response apply(Request request) {
        String device = request.device();
        Boolean value = request.value();

        deviceStateService.setDeviceState(device, value);

        return new Response(deviceStateService.getDeviceState(device));
    }

    public record Request(Boolean value, String device) {
    }

    public record Response(boolean state) {
    }
}