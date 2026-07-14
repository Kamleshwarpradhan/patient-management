package com.pm.billingservice.mapper;

import com.pm.billingservice.dto.InvoiceDTO;
import com.pm.billingservice.model.Invoice;
import org.springframework.stereotype.Component;

@Component
public class MapInvoiceToInvoiceDTO {

    public InvoiceDTO map(Invoice invoice){
        InvoiceDTO invoiceDTO = new InvoiceDTO();

        invoiceDTO.setInvoiceId(invoice.getId().toString());
        invoiceDTO.setDoctorName(invoice.getDoctorName());
        invoiceDTO.setAmount(invoice.getAmount());
        invoiceDTO.setAppointmentId(invoice.getAppointmentId());
        invoiceDTO.setStatus(invoice.getStatus().name());
        invoiceDTO.setPaidAt(invoice.getPaidAt() != null ? invoice.getPaidAt().toString() : null);
        invoiceDTO.setCreatedAt(String.valueOf(invoice.getCreatedAt()));

        return invoiceDTO;
    }
}
