package org.example.service;

import lombok.Data;
import org.example.model.WikiDocument;
import org.example.repo.RAGDocumentRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Data
@Service
public class WikiDocumentsServiceImpl {
    private final RAGDocumentRepository RAGDocumentRepository;

    public void saveWikiDocument(String filePath) {
        try {
            String content = Files.readString(Path.of(filePath));
            WikiDocument wikiDocument = new WikiDocument();
            wikiDocument.setFilePath(filePath);
            wikiDocument.setContent(content);

            RAGDocumentRepository.saveDocument(wikiDocument);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}