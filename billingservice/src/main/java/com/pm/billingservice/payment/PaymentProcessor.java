package com.pm.billingservice.payment;

import com.pm.billingservice.model.BillingAccount;
import com.pm.billingservice.model.Invoice;
import com.pm.billingservice.model.PaymentMethod;

public interface PaymentProcessor {
    /**
     * Process a payment for the given invoice.
     * Each implementation handles its own payment gateway logic.
     */
    PaymentResult processPayment(Invoice invoice, BillingAccount account);
    /**
     * Returns which payment method this processor handles.
     * Used by PaymentService to build the processor lookup map.
     */
    PaymentMethod getPaymentMethod();
}
