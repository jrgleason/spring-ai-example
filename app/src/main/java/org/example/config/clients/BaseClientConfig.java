package org.example.config.clients;

import lombok.Data;
import org.example.config.SpringAIConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Import;

@Data
@Import({SpringAIConfig.class})
public abstract class BaseClientConfig {
    @Value("${app.bot.instructions}")
    protected String instructions;
}