package org.example.model;


import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RagDocument<T> {
    private String filePath;
    private T content;
    private Map<String, Object> metadata = new HashMap<>();

    public RagDocument(String filePath, T content) {
        this.filePath = filePath;
        this.content = content;
    }

    public void addMetadata(String key, Object value) {
        this.metadata.put(key, value);
    }
}
