package com.pm.billingservice.payment;

public class PaymentResult {
    private final boolean success;
    private final String transactionId;
    private final String message;

    private PaymentResult(boolean success, String transactionId, String message) {
        this.success = success;
        this.transactionId = transactionId;
        this.message = message;
    }
    // Factory methods (cleaner than constructors)
    public static PaymentResult success(String transactionId) {
        return new PaymentResult(true, transactionId, "Payment successful");
    }
    public static PaymentResult failure(String message) {
        return new PaymentResult(false, null, message);
    }
    // Getters
    public boolean isSuccess() { return success; }
    public String getTransactionId() { return transactionId; }
    public String getMessage() { return message; }
}
