package com.pm.billingservice.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pm.billingservice.model.BillingAccount;
import com.pm.billingservice.model.Invoice;
import com.pm.billingservice.model.InvoiceStatus;
import com.pm.billingservice.repository.BillingAccountRepository;
import com.pm.billingservice.repository.InvoiceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AppointmentEventListener {

    private static final Logger log = LoggerFactory.getLogger(AppointmentEventListener.class);
    private final BillingAccountRepository billingAccountRepository;
    private final InvoiceRepository invoiceRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AppointmentEventListener(BillingAccountRepository billingAccountRepository,
                                    InvoiceRepository invoiceRepository) {
        this.billingAccountRepository = billingAccountRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @KafkaListener(topics = "appointment-events", groupId = "billing-service-group")
    public void handleAppointmentEvent(String message) {
        try {
            JsonNode event = objectMapper.readTree(message);
            String eventType = event.get("event").asText();

            if ("APPOINTMENT_CONFIRMED".equals(eventType)) {
                String patientEmail = event.get("patientEmail").asText();
                String appointmentId = event.get("appointmentId").asText();
                String doctorName = event.get("doctorName").asText();

                // Handle null consultationFee gracefully with a default
                BigDecimal fee = BigDecimal.valueOf(500);
                if (event.has("consultationFee") && !event.get("consultationFee").isNull()) {
                    fee = new BigDecimal(event.get("consultationFee").asText());
                }

                BillingAccount account = billingAccountRepository
                        .findByEmail(patientEmail)
                        .orElse(null);

                if (account == null) {
                    log.warn("No billing account found for patient: {}", patientEmail);
                    return;
                }

                // Prevent duplicate invoices for the same appointment
                if (invoiceRepository.findByAppointmentId(appointmentId).isPresent()) {
                    log.warn("Invoice already exists for appointment: {}", appointmentId);
                    return;
                }

                Invoice invoice = new Invoice();
                invoice.setBillingAccount(account);
                invoice.setAppointmentId(appointmentId);
                invoice.setDoctorName(doctorName);
                invoice.setAmount(fee);
                invoice.setStatus(InvoiceStatus.PENDING);
                invoiceRepository.save(invoice);

                log.info("Created invoice for appointment {} - amount: {}, patient: {}",
                        appointmentId, fee, patientEmail);
            }
        } catch (Exception e) {
            log.error("Failed to process appointment event: {}", message, e);
        }
    }
}
