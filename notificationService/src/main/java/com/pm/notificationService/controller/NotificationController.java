package com.pm.notificationService.controller;

import com.pm.notificationService.service.SseNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final SseNotificationService sseNotificationService;

    public NotificationController(SseNotificationService sseNotificationService) {
        this.sseNotificationService = sseNotificationService;
    }

    @GetMapping("/stream")
    public SseEmitter stream(@RequestHeader("X-User-Email") String email) {
        return sseNotificationService.createEmitter(email);
    }
}
