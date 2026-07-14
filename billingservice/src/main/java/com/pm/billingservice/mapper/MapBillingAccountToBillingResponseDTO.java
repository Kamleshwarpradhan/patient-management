package com.pm.billingservice.mapper;

import com.pm.billingservice.dto.BillingResponseDTO;
import com.pm.billingservice.model.BillingAccount;
import org.springframework.stereotype.Component;

@Component
public class MapBillingAccountToBillingResponseDTO {

    public BillingResponseDTO map(BillingAccount account){
        BillingResponseDTO billingResponseDTO = new BillingResponseDTO();

        billingResponseDTO.setName(account.getName());
        billingResponseDTO.setEmail(account.getEmail());
        billingResponseDTO.setPatientId(account.getPatientId());
        billingResponseDTO.setAccountId(String.valueOf(account.getId()));
        billingResponseDTO.setBalance(account.getBalance());
        billingResponseDTO.setCreatedAt(account.getCreatedAt());

        return billingResponseDTO;
    }
}
