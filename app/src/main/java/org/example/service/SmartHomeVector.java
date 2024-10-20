package org.example.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Service
public class SmartHomeVector {
    private static final Logger logger = LoggerFactory.getLogger(SmartHomeVector.class);
    private final VectorStore vectorStore;
    private final ObjectMapper objectMapper;
    private final HaNetworkCache haNetworkCache;

    public void updateSmartHomeVectors() throws JsonProcessingException {
        String smartHomeJson = haNetworkCache.getSmartHomeJson();
        List<Document> documents = tokenizeSmartHomeStatus(smartHomeJson);
        vectorStore.add(documents);
        logger.warn("Smart Home Vectors Updated");
    }

    private List<Document> tokenizeSmartHomeStatus(String smartHomeJson) throws JsonProcessingException {
        List<Document> documents = new ArrayList<>();
        JsonNode rootNode = objectMapper.readTree(smartHomeJson);
        tokenizeNode("", rootNode, documents, new HashMap<>());
        return documents;
    }

    private void tokenizeNode(String path, JsonNode node, List<Document> documents, Map<String, Object> parentMetadata) {
        if (node.isObject()) {
            node.fields().forEachRemaining(entry -> {
                String newPath = path.isEmpty() ? entry.getKey() : path + "." + entry.getKey();
                Map<String, Object> newMetadata = new HashMap<>(parentMetadata);
                newMetadata.put("path", newPath);
                tokenizeNode(newPath, entry.getValue(), documents, newMetadata);
            });
        } else if (node.isArray()) {
            for (int i = 0; i < node.size(); i++) {
                String newPath = path + "[" + i + "]";
                Map<String, Object> newMetadata = new HashMap<>(parentMetadata);
                newMetadata.put("path", newPath);
                newMetadata.put("index", i);
                tokenizeNode(newPath, node.get(i), documents, newMetadata);
            }
        } else {
            String content = path + ": " + node.asText();
            Map<String, Object> metadata = new HashMap<>(parentMetadata);
            metadata.put("value", node.asText());
            documents.add(new Document(content, metadata));
        }
    }
}