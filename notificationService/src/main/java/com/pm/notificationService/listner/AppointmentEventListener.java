package com.pm.notificationService.listner;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pm.notificationService.dto.AppointmentEvent;
import com.pm.notificationService.services.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
@Component
public class AppointmentEventListener {
    private static final Logger log = LoggerFactory.getLogger(
            AppointmentEventListener.class);
    private final EmailService emailService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    public AppointmentEventListener(EmailService emailService) {
        this.emailService = emailService;
    }
    @KafkaListener(topics = "appointment-events", groupId = "notification-group")
    public void handleEvent(String message) {
        log.info("📨 Received Kafka message: {}", message);
        try {
            AppointmentEvent event = objectMapper.readValue(
                    message, AppointmentEvent.class);
            switch (event.getEvent()) {
                case "APPOINTMENT_CREATED" -> notifyDoctor(event);
                case "APPOINTMENT_CONFIRMED" -> notifyPatient(event);
                default -> log.warn("Unknown event: {}", event.getEvent());
            }
        } catch (Exception e) {
            log.error("Failed to process event: {}", e.getMessage());
        }
    }
    private void notifyDoctor(AppointmentEvent event) {
        String subject = "🏥 New Appointment Request — "
                + event.getSpecialty();
        String body = String.format(
                "Hello Doctor,\n\n"
                        + "A new appointment request has been submitted.\n\n"
                        + "Patient: %s\n"
                        + "Symptoms: %s\n"
                        + "Predicted Specialty: %s\n"
                        + "Appointment ID: %s\n\n"
                        + "Please log in to your dashboard to accept or reject.\n\n"
                        + "— Patient Management System",
                event.getPatientEmail(),
                event.getSymptoms(),
                event.getSpecialty(),
                event.getAppointmentId()
        );
        emailService.sendEmail(event.getDoctorEmail(), subject, body);
    }
    private void notifyPatient(AppointmentEvent event) {
        String subject = "Appointment Confirmed!";
        String body = String.format(
                "Hello,\n\n"
                        + "Great news! Your appointment has been confirmed.\n\n"
                        + "Doctor: %s (%s)\n"
                        + "Appointment ID: %s\n\n"
                        + "Please arrive 10 minutes before your scheduled time.\n\n"
                        + "— Patient Management System",
                event.getDoctorName(),
                event.getDoctorEmail(),
                event.getAppointmentId()
        );
        emailService.sendEmail(event.getPatientEmail(), subject, body);
    }
}
