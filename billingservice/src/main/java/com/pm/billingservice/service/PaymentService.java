package com.pm.billingservice.service;

import com.pm.billingservice.model.*;
import com.pm.billingservice.payment.PaymentProcessor;
import com.pm.billingservice.payment.PaymentResult;
import com.pm.billingservice.repository.BillingAccountRepository;
import com.pm.billingservice.repository.InvoiceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    // Strategy Pattern: Map of PaymentMethod → PaymentProcessor
    private final Map<PaymentMethod, PaymentProcessor> processors;
    private final InvoiceRepository invoiceRepository;
    private final BillingAccountRepository billingAccountRepository;

    // Spring auto-injects ALL beans that implement PaymentProcessor
    public PaymentService(List<PaymentProcessor> processorList,
                          InvoiceRepository invoiceRepository,
                          BillingAccountRepository billingAccountRepository) {
        // Build lookup map: SIMULATED → SimulatedPaymentProcessor, etc.
        this.processors = processorList.stream()
                .collect(Collectors.toMap(
                        PaymentProcessor::getPaymentMethod,
                        Function.identity()
                ));
        this.invoiceRepository = invoiceRepository;
        this.billingAccountRepository = billingAccountRepository;

        log.info("Loaded {} payment processors: {}", processors.size(), processors.keySet());
    }

    @Transactional
    public PaymentResult payInvoice(UUID invoiceId, String patientEmail, PaymentMethod method) {
        // 1. Find the invoice
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        // 2. Verify it belongs to this patient
        BillingAccount account = invoice.getBillingAccount();
        if (!account.getEmail().equals(patientEmail)) {
            return PaymentResult.failure("This invoice does not belong to you");
        }

        // 3. Check if already paid
        if (invoice.getStatus() == InvoiceStatus.PAID) {
            return PaymentResult.failure("Invoice is already paid");
        }

        // 4. Get the correct payment processor (Strategy Pattern!)
        PaymentProcessor processor = processors.get(method);
        if (processor == null) {
            return PaymentResult.failure("Unsupported payment method: " + method);
        }

        // 5. Delegate to the strategy
        PaymentResult result = processor.processPayment(invoice, account);

        // 6. If payment succeeded, update the database
        if (result.isSuccess()) {
            invoice.setStatus(InvoiceStatus.PAID);
            invoice.setPaidAt(LocalDateTime.now());
            invoiceRepository.save(invoice);

            // Update balance (add to balance to track total paid)
            account.setBalance(account.getBalance().add(invoice.getAmount()));
            billingAccountRepository.save(account);

            log.info("Invoice {} paid via {} — txnId: {}",
                    invoiceId, method, result.getTransactionId());
        }

        return result;
    }
}
