package org.example.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Data
@Service
public class SmartHomeVector {
    private static final Logger logger = LoggerFactory.getLogger(SmartHomeVector.class);
    private final VectorStore vectorStore;
    private final ObjectMapper objectMapper;
    private final HaNetworkCache haNetworkCache;

    public void updateSmartHomeVectors() {
        String smartHomeJson = haNetworkCache.getSmartHomeJson();
        List<Document> documents = tokenizeSmartHomeStatus(smartHomeJson);
        vectorStore.add(documents);
        logger.warn("Smart Home Vectors Updated");
    }

    private List<Document> tokenizeSmartHomeStatus(String smartHomeJson) {
        List<Document> documents = new ArrayList<>();
        try {
            JsonNode rootNode = objectMapper.readTree(smartHomeJson);
            tokenizeNode("", rootNode, documents);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return documents;
    }

    private void tokenizeNode(String path, JsonNode node, List<Document> documents) {
        if (node.isObject()) {
            node.fields().forEachRemaining(entry -> {
                String newPath = path.isEmpty() ? entry.getKey() : path + "." + entry.getKey();
                tokenizeNode(newPath, entry.getValue(), documents);
            });
        } else if (node.isArray()) {
            for (int i = 0; i < node.size(); i++) {
                tokenizeNode(path + "[" + i + "]", node.get(i), documents);
            }
        } else {
            String content = path + ": " + node.asText();
            documents.add(new Document(content, null));
        }
    }
}
