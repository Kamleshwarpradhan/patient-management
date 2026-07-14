package com.pm.appointmentService.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AppointmentEventProducer {
    private static final String TOPIC = "appointment-events";
    private final KafkaTemplate<String, String> kafkaTemplate;
    public AppointmentEventProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    /**
     * Sends event as a simple JSON string.
     * Format: {"event":"CREATED","appointmentId":"...","patientEmail":"...","doctorEmail":"...","symptoms":"..."}
     */
    public void sendAppointmentCreated(String appointmentId, String patientEmail,
                                       String doctorEmail, String symptoms, String specialty) {
        String message = String.format(
                "{\"event\":\"APPOINTMENT_CREATED\",\"appointmentId\":\"%s\"," +
                        "\"patientEmail\":\"%s\",\"doctorEmail\":\"%s\"," +
                        "\"symptoms\":\"%s\",\"specialty\":\"%s\"}",
                appointmentId, patientEmail, doctorEmail, symptoms, specialty
        );
        kafkaTemplate.send(TOPIC, message);
    }
    public void sendAppointmentConfirmed(String appointmentId, String patientEmail,
                                         String doctorEmail, String doctorName, BigDecimal consultationFee) {
        String message = String.format(
                "{\"event\":\"APPOINTMENT_CONFIRMED\",\"appointmentId\":\"%s\"," +
                        "\"patientEmail\":\"%s\",\"doctorEmail\":\"%s\",\"doctorName\":\"%s\"," +
                        "\"consultationFee\":%s}",
                appointmentId, patientEmail, doctorEmail, doctorName, consultationFee
        );
        kafkaTemplate.send(TOPIC, message);
    }
}
