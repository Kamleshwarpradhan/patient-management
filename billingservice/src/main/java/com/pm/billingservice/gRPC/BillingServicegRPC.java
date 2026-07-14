package com.pm.billingservice.gRPC;

import billing.BillingRequest;
import billing.BillingResponse;
import billing.BillingServiceGrpc;
import com.pm.billingservice.model.BillingAccount;
import com.pm.billingservice.repository.BillingAccountRepository;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.math.BigDecimal;

@GrpcService
public class BillingServicegRPC extends BillingServiceGrpc.BillingServiceImplBase {

    private static final Logger log = LoggerFactory.getLogger(BillingServicegRPC.class);
    private final BillingAccountRepository billingAccountRepository;

    public BillingServicegRPC(BillingAccountRepository billingAccountRepository) {
        this.billingAccountRepository = billingAccountRepository;
    }

    @Override
    public void createBillingAccount(BillingRequest billingRequest,
                                     StreamObserver<BillingResponse> responseStreamObserver) {
        log.info("createBillingAccount request received: {}", billingRequest.toString());

        try {
            // 1. Map gRPC Request to JPA Entity
            BillingAccount account = new BillingAccount();
            account.setPatientId(billingRequest.getPatientId());
            account.setName(billingRequest.getName());
            account.setEmail(billingRequest.getEmail());
            account.setBalance(BigDecimal.ZERO);

            // 2. Save entity to PostgreSQL
            BillingAccount savedAccount = billingAccountRepository.save(account);
            log.info("Saved billing account for patient: {} with DB ID: {}",
                    savedAccount.getPatientId(), savedAccount.getId());

            // 3. Construct gRPC Response with the generated ID
            BillingResponse response = BillingResponse.newBuilder()
                    .setAccountId(savedAccount.getId().toString())
                    .setStatus("ACTIVE")
                    .build();

            // 4. Emit response and close the stream
            responseStreamObserver.onNext(response);
            responseStreamObserver.onCompleted();

        } catch (Exception e) {
            log.error("Failed to create billing account", e);
            responseStreamObserver.onError(io.grpc.Status.INTERNAL
                    .withDescription("Failed to create billing account: " + e.getMessage())
                    .asRuntimeException());
        }
    }
}
