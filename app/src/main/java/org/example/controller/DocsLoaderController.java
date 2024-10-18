package org.example.controller;

import lombok.Data;
import org.example.service.RagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Data
@RestController
@RequestMapping("/api/docs")
public class DocsLoaderController {

    public static final String DOCS_PATH= "documentation/test-hf.json";

    private final RagService docsLoaderService;

    public DocsLoaderController(@Autowired RagService docsLoaderService) {
        this.docsLoaderService = docsLoaderService;
    }

    @GetMapping("/load")
    public ResponseEntity<Void> loadDocuments() {
        if(docsLoaderService.loadDocs(DOCS_PATH)){
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

}