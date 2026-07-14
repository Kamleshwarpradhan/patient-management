package com.pm.billingservice.repository;

import com.pm.billingservice.model.BillingAccount;
import com.pm.billingservice.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    List<Invoice> findByBillingAccountOrderByCreatedAtDesc(BillingAccount account);
    Optional<Invoice> findByAppointmentId(String appointmentId);
}
