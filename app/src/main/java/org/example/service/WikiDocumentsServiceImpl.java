package org.example.service;

import lombok.Data;
import org.example.model.WikiDocument;
import org.example.repo.WikiDocumentsRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Data
@Service
public class WikiDocumentsServiceImpl {
    private final WikiDocumentsRepository wikiDocumentsRepository;

    public void saveWikiDocument(String filePath) {
        try {
            String content = Files.readString(Path.of(filePath));
            WikiDocument wikiDocument = new WikiDocument();
            wikiDocument.setFilePath(filePath);
            wikiDocument.setContent(content);

            wikiDocumentsRepository.saveWikiDocument(wikiDocument);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}