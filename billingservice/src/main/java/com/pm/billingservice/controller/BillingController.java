package com.pm.billingservice.controller;

import com.pm.billingservice.dto.BillingResponseDTO;
import com.pm.billingservice.dto.InvoiceDTO;
import com.pm.billingservice.dto.PaymentRequestDTO;
import com.pm.billingservice.dto.PaymentResponseDTO;
import com.pm.billingservice.mapper.MapBillingAccountToBillingResponseDTO;
import com.pm.billingservice.mapper.MapInvoiceToInvoiceDTO;
import com.pm.billingservice.model.BillingAccount;
import com.pm.billingservice.model.Invoice;
import com.pm.billingservice.model.PaymentMethod;
import com.pm.billingservice.payment.PaymentResult;
import com.pm.billingservice.repository.BillingAccountRepository;
import com.pm.billingservice.repository.InvoiceRepository;
import com.pm.billingservice.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/billing")
public class BillingController {

    private final BillingAccountRepository billingAccountRepository;
    private final MapBillingAccountToBillingResponseDTO mapBillingAccountToBillingResponseDTO;
    private final InvoiceRepository invoiceRepository;
    private final MapInvoiceToInvoiceDTO mapInvoiceToInvoiceDTO;
    private final PaymentService paymentService;

    public BillingController(BillingAccountRepository billingAccountRepository, MapBillingAccountToBillingResponseDTO mapBillingAccountToBillingResponseDTO, InvoiceRepository invoiceRepository, MapInvoiceToInvoiceDTO mapInvoiceToInvoiceDTO, PaymentService paymentService) {
        this.billingAccountRepository = billingAccountRepository;
        this.mapBillingAccountToBillingResponseDTO = mapBillingAccountToBillingResponseDTO;
        this.invoiceRepository = invoiceRepository;
        this.mapInvoiceToInvoiceDTO = mapInvoiceToInvoiceDTO;
        this.paymentService = paymentService;
    }

    @GetMapping("/account")
    public ResponseEntity<BillingResponseDTO> getAccountDetails(@RequestHeader("X-User-Email") String email){
        BillingAccount account = billingAccountRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("No billing account"));

        BillingResponseDTO billingResponseDTO = mapBillingAccountToBillingResponseDTO.map(account);

        return ResponseEntity.ok(billingResponseDTO);
    }

    @GetMapping("/invoices")
    public ResponseEntity<List<InvoiceDTO>> getInvoices(@RequestHeader("X-User-Email") String email){
        BillingAccount account = billingAccountRepository.findByEmail(email)
                .orElseThrow();
        List<Invoice> invoices = invoiceRepository
                .findByBillingAccountOrderByCreatedAtDesc(account);

        List<InvoiceDTO> invoiceDTOS = invoices.stream().map(
                mapInvoiceToInvoiceDTO::map
        ).toList();

        return ResponseEntity.ok(invoiceDTOS);
    }

    @PutMapping("/invoices/{invoiceId}/pay")
    public ResponseEntity<PaymentResponseDTO> payInvoice( @PathVariable UUID invoiceId,
                                                          @RequestBody PaymentRequestDTO request,
                                                          @RequestHeader("X-User-Email") String email){
        PaymentMethod method = PaymentMethod.valueOf(
                request.getPaymentMethod().toUpperCase()
        );

        PaymentResult result = paymentService.payInvoice(invoiceId,email,method);

        PaymentResponseDTO response = new PaymentResponseDTO();
        response.setSuccess(result.isSuccess());
        response.setTransactionId(result.getTransactionId());
        response.setMessage(result.getMessage());

        if (result.isSuccess()) {
            Invoice updatedInvoice = invoiceRepository.findById(invoiceId).orElseThrow();
            response.setInvoice(mapInvoiceToInvoiceDTO.map(updatedInvoice));
        }

        return result.isSuccess()
                ?ResponseEntity.ok(response)
                :ResponseEntity.badRequest().body(response);
    }
}
