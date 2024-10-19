package org.example.component;

import lombok.Data;
import org.example.service.HaNetworkCache;
import org.example.service.SmartHomeVector;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Data
@Component
public class BootComponent {
    private final HaNetworkCache haNetworkCache;
    private final SmartHomeVector smartHomeVector;
    /**
     * This method is called when the application is ready to start
     * It is meant to make it feel like there is less of a lag in the cache
     */
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        haNetworkCache.getSmartHomeJson(); // This will populate the cache on application startup
        smartHomeVector.updateSmartHomeVectors(); // This will populate the vector store on application startup
    }
}
