package com.pm.billingservice.payment;

import com.pm.billingservice.model.BillingAccount;
import com.pm.billingservice.model.Invoice;
import com.pm.billingservice.model.PaymentMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SimulatedPaymentProcessor implements PaymentProcessor{

    private static final Logger log = LoggerFactory.getLogger(SimulatedPaymentProcessor.class);

    @Override
    public PaymentResult processPayment(Invoice invoice, BillingAccount account){
        log.info("🔄 Simulating payment of ₹{} for invoice {} (patient: {})",
                invoice.getAmount(), invoice.getId(), account.getEmail());
        // Generate a fake transaction ID
        String transactionId = "SIM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.info("✅ Simulated payment successful — txnId: {}", transactionId);
        return PaymentResult.success(transactionId);
    }

    @Override
    public PaymentMethod getPaymentMethod() {
        return PaymentMethod.SIMULATED;
    }
}
