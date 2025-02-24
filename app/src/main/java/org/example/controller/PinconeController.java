package org.example.controller;

import com.google.gson.Gson;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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
        Gson gson = new Gson();
        String content = gson.toJson(payload);
        Document doc = new Document(content);
        vectorStore.add(List.of(doc));
        return ResponseEntity.ok().build();
    }

    @GetMapping("search")
    public List<Map<String, Object>> searchDocuments() {
        // Retrieve documents similar to a query
        List<Document> results = this.vectorStore.similaritySearch(SearchRequest.builder().query("Smart Home").topK(5).build());
        return Objects.requireNonNull(results).stream().map(doc -> Map.of(
                "id", doc.getId(), // Include the id property
                "content", Objects.requireNonNull(doc.getText()),
                "metadata", doc.getMetadata()
        )).collect(Collectors.toList());
    }

    @DeleteMapping("delete")
    public ResponseEntity<Void> deleteDocument(@RequestParam String id) {
        // Implement the logic to delete a document by its ID
        vectorStore.delete(Collections.singletonList(id));
        return ResponseEntity.noContent().build();
    }
}
