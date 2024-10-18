package org.example.controller;

import lombok.Data;
import org.example.service.WikiDocumentsServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Data
@RestController
@RequestMapping("wiki")
public class WikiDocumentsController {
    private final WikiDocumentsServiceImpl wikiDocumentsService;

    // constructors

    @PostMapping
    public ResponseEntity<Void> saveDocument(
            @RequestParam String filePath
    ) {
        wikiDocumentsService.saveWikiDocument(filePath);

        return ResponseEntity.status(201).build();
    }
}