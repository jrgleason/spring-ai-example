package org.example.controller;

import org.example.service.DeviceStateService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/devices")
public class DeviceController {
    private final DeviceStateService deviceStateService;

    public DeviceController(DeviceStateService deviceStateService) {
        this.deviceStateService = deviceStateService;
    }

    @GetMapping("/states")
    public Map<String, Boolean> getAllDeviceStates() {
        return deviceStateService.getAllDeviceStates();
    }
}