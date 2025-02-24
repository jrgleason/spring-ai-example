package org.example.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    @GetMapping("/root")
    public ResponseEntity<Void> rootEndpoint() {
        return ResponseEntity.ok().build();
    }


}