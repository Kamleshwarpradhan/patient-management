package com.pm.billingservice.gRPC;

import billing.BillingRequest;
import billing.BillingResponse;
import billing.BillingServiceGrpc;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@GrpcService
public class BillingServicegRPC extends BillingServiceGrpc.BillingServiceImplBase {

    private static final Logger log = LoggerFactory.getLogger(BillingServicegRPC.class);

    // StreamObserver :- when we have connected to gRPC server it allows us to send back and forth messages
    @Override
    public void createBillingAccount(BillingRequest billingRequest,
                                     StreamObserver<BillingResponse> responseStreamObserver){
        log.info("createBillingAccount request received {}",billingRequest.toString());

        // TODO Business Logic : ex save to Database , perform calculation etc

        BillingResponse response = BillingResponse.newBuilder()
                .setAccountId("12345")
                .setStatus("ACTIVE")
                .build();

        responseStreamObserver.onNext(response);
        responseStreamObserver.onCompleted();
    }
}
