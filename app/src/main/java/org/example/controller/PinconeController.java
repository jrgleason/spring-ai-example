package org.example.controller;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("pinecone")
public class PinconeController {
    private final VectorStore vectorStore;

    public PinconeController(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    @PostMapping("add")
    public ResponseEntity<Void> addDocument(@RequestBody Map<String, Object> payload) {
        String content = payload.toString();
        Document doc = new Document(content);
        vectorStore.add(List.of(doc));
        return ResponseEntity.ok().build();
    }

    @GetMapping("search")
    public List<Map<String, Object>> searchDocuments() {

        // Retrieve documents similar to a query
        List<Document> results = this.vectorStore.similaritySearch(SearchRequest.query("Smart Home").withTopK(5));

        return results.stream().map(doc -> Map.of(
                "content", doc.getContent(),
                "metadata", doc.getMetadata()
        )).collect(Collectors.toList());
    }
}
