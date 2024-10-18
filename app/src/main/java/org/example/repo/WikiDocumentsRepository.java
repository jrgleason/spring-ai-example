package org.example.repo;

import lombok.Data;
import org.example.model.WikiDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Component
public class WikiDocumentsRepository {
    private static final Logger logger = LoggerFactory.getLogger(WikiDocumentsRepository.class);
    private final VectorStore vectorStore;

    public void saveWikiDocument(WikiDocument wikiDocument) {
        logger.info("Saving WikiDocument: {}", wikiDocument);

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("filePath", wikiDocument.getFilePath());
        Document document = new Document(wikiDocument.getContent(), metadata);
        List<Document> documents = new TokenTextSplitter().apply(List.of(document));

        logger.info("Metadata: {}", metadata);
        logger.info("Documents before saving: {}", documents);

        vectorStore.add(documents);

        logger.info("Documents saved to vectorStore: {}", documents);
    }
}