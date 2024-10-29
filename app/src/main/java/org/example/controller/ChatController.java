package org.example.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("chat")
public class ChatController {
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final ChatClient chatClient;
    private final ChatClient anthropicChatClient;
    private final VectorStore vectorStore;

    public ChatController(
            @Qualifier("buildClient") ChatClient client,
            @Qualifier("buildAnthropicClient") ChatClient anthropicClient,
            VectorStore vectorStore) {
        this.chatClient = client;
        this.anthropicChatClient = anthropicClient;
        this.vectorStore = vectorStore;
    }


    @GetMapping("/openai")
    public ResponseEntity<String> question(
            @RequestParam(
                    value = "message",
                    defaultValue = "How to analyze time-series data with Python and MongoDB?"
            ) String message
    ) {
        String responseContent = chatClient.prompt()
                .user(message)
                .call()
                .content();
        return ResponseEntity.ok(responseContent);
    }

    @GetMapping("/anthropic")
    public ResponseEntity<String> questionAnthropic(
            @RequestParam(
                    value = "message",
                    defaultValue = "How to analyze time-series data with Python and MongoDB?"
            ) String message
    ) {
        String responseContent = anthropicChatClient.prompt()
                .user(message)
                .call()
                .content();
        return ResponseEntity.ok(responseContent);
    }

    @GetMapping("/add")
    public ResponseEntity<String> addDocuments() {
        List<Document> docs = List.of(
                new Document("Proper tuber planting involves site selection, proper timing, and exceptional care. Choose spots with well-drained soil and adequate sun exposure. Tubers are generally planted in spring, but depending on the plant, timing varies. Always plant with the eyes facing upward at a depth two to three times the tuber's height. Ensure 4 inch spacing between small tubers, expand to 12 inches for large ones. Adequate moisture is needed, yet do not overwater. Mulching can help preserve moisture and prevent weed growth.", Map.of("author", "A", "type", "post")),
                new Document("Successful oil painting necessitates patience, proper equipment, and technique. Begin with a carefully prepared, primed canvas. Sketch your composition lightly before applying paint. Use high-quality brushes and oils to create vibrant, long-lasting artworks. Remember to paint 'fat over lean,' meaning each subsequent layer should contain more oil to prevent cracking. Allow each layer to dry before applying another. Clean your brushes often and avoid solvents that might damage them. Finally, always work in a well-ventilated space.", Map.of("author", "A")),
                new Document("For a natural lawn, selection of the right grass type suitable for your climate is crucial. Balanced watering, generally 1 to 1.5 inches per week, is important; overwatering invites disease. Opt for organic fertilizers over synthetic versions to provide necessary nutrients and improve soil structure. Regular lawn aeration helps root growth and prevents soil compaction. Practice natural pest control and consider overseeding to maintain a dense sward, which naturally combats weeds and pest.", Map.of("author", "B", "type", "post"))
        );

        vectorStore.add(docs);
        return ResponseEntity.ok("Documents added successfully!");
    }

    @GetMapping("/search")
    public List<Map<String, Object>> searchDocuments() {

        List<Document> results = vectorStore.similaritySearch(
                SearchRequest
                        .query("learn how to grow things")
                        .withTopK(2)
        );

        return results.stream().map(doc -> Map.of(
                "content", doc.getContent(),
                "metadata", doc.getMetadata()
        )).collect(Collectors.toList());
    }

    @GetMapping("/")
    public ResponseEntity<Void> rootEndpoint() {
        return ResponseEntity.ok().build();
    }
}
