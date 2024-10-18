package org.example.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class RagService {
    private static final int MAX_TOKENS_PER_CHUNK = 2000;
    private final VectorStore vectorStore;
    private final ObjectMapper objectMapper;

    public RagService(
            @Autowired VectorStore vectorStore,
            @Autowired ObjectMapper objectMapper
    ) {
        this.vectorStore = vectorStore;
        this.objectMapper = objectMapper;
    }

    public String loadDocs(String filePath) {
        try (InputStream inputStream = new ClassPathResource(filePath).getInputStream();
             BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            List<Document> documents = new ArrayList<>();
            String line;
            while ((line = reader.readLine()) != null) {
                try {
                    Map<String, Object> jsonDoc = objectMapper.readValue(line, Map.class);
                    String content = (String) jsonDoc.get("body");
                    if (content != null) {
                        List<String> chunks = splitIntoChunks(content, MAX_TOKENS_PER_CHUNK);
                        for (String chunk : chunks) {
                            Document document = createDocument(jsonDoc, chunk);
                            documents.add(document);
                        }
                        if (documents.size() >= 100) {
                            vectorStore.add(documents);
                            documents.clear();
                        }
                    } else {
                        return "Error: 'body' field is missing in the JSON document.";
                    }
                } catch (JsonMappingException e) {
                    return "JSON mapping error at line: " + line + " - " + e.getMessage();
                } catch (JsonProcessingException e) {
                    return "JSON processing error at line: " + line + " - " + e.getMessage();
                }
            }
            if (!documents.isEmpty()) {
                vectorStore.add(documents);
            }
            return "All documents added successfully!";
        } catch (Exception e) {
            return "An error occurred while adding documents: " + e.getMessage() + Arrays.toString(e.getStackTrace());
        }
    }

    private Document createDocument(Map<String, Object> jsonMap, String content) {
        Map<String, Object> metadata = (Map<String, Object>) jsonMap.get("metadata");
        metadata.putIfAbsent("sourceName", jsonMap.get("sourceName"));
        metadata.putIfAbsent("url", jsonMap.get("url"));
        metadata.putIfAbsent("action", jsonMap.get("action"));
        metadata.putIfAbsent("format", jsonMap.get("format"));
        metadata.putIfAbsent("updated", jsonMap.get("updated"));
        return new Document(content, metadata);
    }

    private List<String> splitIntoChunks(String content, int maxTokens) {
        List<String> chunks = new ArrayList<>();
        String[] words = content.split("\\s+");
        StringBuilder chunk = new StringBuilder();
        int tokenCount = 0;
        for (String word : words) {
            // Estimate token count for the word (approximated by character length for simplicity)
            int wordTokens = word.length() / 4;  // Rough estimate: 1 token = ~4 characters
            if (tokenCount + wordTokens > maxTokens) {
                chunks.add(chunk.toString());
                chunk.setLength(0); // Clear the buffer
                tokenCount = 0;
            }
            chunk.append(word).append(" ");
            tokenCount += wordTokens;
        }
        if (!chunk.isEmpty()) {
            chunks.add(chunk.toString());
        }
        return chunks;
    }
}
