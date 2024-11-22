package org.example.prompt;

import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;

public class SimplePromptTemplate extends PromptTemplate {
    public SimplePromptTemplate(String prompt) {
        super(prompt);
    }

    @Override
    public Prompt create() {
        Prompt p = super.create();
        return p;
    }
}