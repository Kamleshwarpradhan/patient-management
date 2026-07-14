package com.pm.billingservice.model;

public enum PaymentMethod {
    SIMULATED,
    // Future:
    // RAZORPAY,
    // STRIPE,
    // UPI
}
// Why an enum?: Type-safe, prevents typos like "razorPay" vs "razorpay", and makes it easy to add new methods.
