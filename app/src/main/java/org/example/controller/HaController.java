package org.example.controller;

import org.example.service.HaNetworkCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ha")
public class HaController {
    private final HaNetworkCache haNetworkCache;

    @Autowired
    public HaController(HaNetworkCache haNetworkCache) {
        this.haNetworkCache = haNetworkCache;
    }

    @GetMapping(value = "/status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getSmartHomeStatus() {
        String smartHomeJson = haNetworkCache.getSmartHomeJson();
        return ResponseEntity.ok(smartHomeJson);
    }
}
