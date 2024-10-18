package org.example;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
@SpringBootTest
class RAGMongoDBApplicationManualTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @Disabled("Need to figure out how to have an actual mongo instance")
    void givenMongoDBVectorStore_whenCallingPostDocumentEndpoint_thenExpectedResponseCodeShouldBeReturned() throws Exception {
        mockMvc.perform(post("/wiki?filePath={filePath}",
                        "src/test/resources/documentation/owl-documentation.md"))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/wiki?filePath={filePath}",
                        "src/test/resources/documentation/rag-documentation.md"))
                .andExpect(status().isCreated());
    }
}