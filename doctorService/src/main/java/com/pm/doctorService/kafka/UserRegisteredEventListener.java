package com.pm.doctorService.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pm.doctorService.model.Doctor;
import com.pm.doctorService.repository.DoctorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UserRegisteredEventListener {

    private static final Logger log = LoggerFactory.getLogger(UserRegisteredEventListener.class);

    private final DoctorRepository doctorRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    public UserRegisteredEventListener(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @KafkaListener(topics = "user-registered", groupId = "doctor-group")
    public void handleUserRegistered(String message) {
        log.info("📨 Doctor Service received user-registered event: {}", message);
        try{

            JsonNode json = objectMapper.readTree(message);
            String role = json.get("role").asText();

            // Check whether it is a doctor registrations (role = USER) as we want to process only doctors registration here
            if (!"USER".equals(role)) {
                log.info("⏭️ Skipping non-doctor registration (role={})", role);
                return;
            }

            String userId = json.get("userId").asText();
            String email = json.get("email").asText();
            String name = json.get("name").asText();
            String specialty = json.has("specialty") && !json.get("specialty").asText().isEmpty()
                    ? json.get("specialty").asText() : null;

            // Check if doctor already exists (idempotency)
            if (doctorRepository.existsByEmail(email)) {
                log.info("⚠️ Doctor with email {} already exists, skipping", email);
                return;
            }

            Doctor doctor = new Doctor();
            doctor.setId(UUID.fromString(userId));
            doctor.setName(name);
            doctor.setEmail(email);
            doctor.setSpecialty(specialty);
            doctorRepository.save(doctor);
            log.info("✅ Doctor profile auto-created for: {} ({})", name, email);

        } catch (Exception e) {
            log.error("❌ Failed to process user-registered event: {}", e.getMessage(), e);
        }
    }
}
