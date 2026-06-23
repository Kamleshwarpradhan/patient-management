package com.pm.authService.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class UserRegisteredProducer {

    private static final Logger log = LoggerFactory.getLogger(UserRegisteredProducer.class);

    private static final String TOPIC = "user-registered";
    private final KafkaTemplate<String, String> kafkaTemplate;

    public UserRegisteredProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendUserRegisteredEvent(String userId, String email, String name, String role,
                                        String specialty,LocalDate dateOfBirth, String address){
        String message = String.format(
                "{\"event\":\"USER_REGISTERED\",\"userId\":\"%s\"," +
                        "\"email\":\"%s\",\"name\":\"%s\"," +
                        "\"role\":\"%s\",\"specialty\":\"%s\"," +
                        "\"dateOfBirth\":\"%s\",\"address\":\"%s\"}",
                userId,
                email,
                name,
                role,
                specialty != null ? specialty : "",
                dateOfBirth != null ? dateOfBirth.toString() : "",   // ISO format: YYYY-MM-DD
                address != null ? address : ""
        );

        log.info("📤 Publishing user-registered event: {}", message);
        kafkaTemplate.send(TOPIC, message);
    }
}
