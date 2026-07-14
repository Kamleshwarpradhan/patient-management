package com.pm.patientservice.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pm.patientservice.model.Patient;
import com.pm.patientservice.repository.PatientRepository;
import com.pm.patientservice.grpc.BillingServiceGrpcClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class UserRegisteredEventListener {

    private static final Logger log = LoggerFactory.getLogger(UserRegisteredEventListener.class);

    private final PatientRepository patientRepository;
    private final BillingServiceGrpcClient billingServiceGrpcClient;
    private final ObjectMapper objectMapper = new ObjectMapper();


    public UserRegisteredEventListener(PatientRepository patientRepository, BillingServiceGrpcClient billingServiceGrpcClient) {
        this.patientRepository = patientRepository;
        this.billingServiceGrpcClient = billingServiceGrpcClient;
    }

    @KafkaListener(topics = "user-registered", groupId = "patient-group")
    public void handleUserRegistered(String message) {
        log.info("📨 Patient Service received user-registered event: {}", message);

        try {

            JsonNode json = objectMapper.readTree(message);
            String role = json.get("role").asText();

            // Check if it is a patient registrations as we want to process only patient registration here
            if (!"PATIENT".equals(role)) {
                log.info("⏭️ Skipping non-patient registration (role={})", role);
                return;
            }

            String email = json.get("email").asText();
            String name = json.get("name").asText();

            // Idempotency check
            if (patientRepository.existsByEmail(email)) {
                log.info("⚠️ Patient with email {} already exists, skipping", email);
                return;
            }

            String address = json.has("address") && !json.get("address").asText().isEmpty()
                        ? json.get("address").asText() : "Not provided";

            LocalDate dob = json.has("dateOfBirth") && !json.get("dateOfBirth").asText().isEmpty()
                       ? LocalDate.parse(json.get("dateOfBirth").asText()) : LocalDate.of(2000, 1, 1);

            Patient patient = new Patient();
            patient.setName(name);
            patient.setEmail(email);
            patient.setAddress(address);       // Default — patient updates later
            patient.setDateofBirth(dob); // Default placeholder
            patient.setRegisteredDate(LocalDate.now());
            // doctorEmail is left null — gets assigned when a doctor accepts an appointment

            Patient savedPatient = patientRepository.save(patient);
            log.info("✅ Patient profile auto-created for: {} ({})", name, email);

            try {
                billingServiceGrpcClient.createBillingAccount(savedPatient.getId().toString(),
                        savedPatient.getName(), savedPatient.getEmail());
                log.info("✅ Billing account successfully created for patient ID: {}", savedPatient.getId());
            } catch (Exception e) {
                log.error("❌ Failed to create billing account via gRPC: {}", e.getMessage(), e);
            }

        } catch (Exception e) {
            log.error("❌ Failed to process user-registered event: {}", e.getMessage(), e);
        }
    }
}
