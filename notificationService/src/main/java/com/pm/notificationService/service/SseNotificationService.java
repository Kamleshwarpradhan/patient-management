package com.pm.notificationService.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseNotificationService {
    // Map email -> active SSE connections
    private final Map<String, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public SseEmitter createEmitter(String email) {
        // Keep connection alive indefinitely (or use a large timeout like 10 minutes)
        SseEmitter emitter = new SseEmitter(600_000L);
        
        emitters.computeIfAbsent(email, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> removeEmitter(email, emitter));
        emitter.onTimeout(() -> removeEmitter(email, emitter));
        emitter.onError(e -> removeEmitter(email, emitter));

        return emitter;
    }

    private void removeEmitter(String email, SseEmitter emitter) {
        List<SseEmitter> userEmitters = emitters.get(email);
        if (userEmitters != null) {
            userEmitters.remove(emitter);
            if (userEmitters.isEmpty()) {
                emitters.remove(email);
            }
        }
    }

    public void sendNotification(String email, String message) {
        List<SseEmitter> userEmitters = emitters.get(email);
        if (userEmitters != null) {
            userEmitters.forEach(emitter -> {
                try {
                    emitter.send(SseEmitter.event()
                            .name("notification")
                            .data(message));
                } catch (IOException e) {
                    emitter.completeWithError(e);
                    removeEmitter(email, emitter);
                }
            });
        }
    }
}
