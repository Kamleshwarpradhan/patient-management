package com.pm.patientservice.services;

import com.pm.patientservice.dto.PatientRequestDTO;
import com.pm.patientservice.dto.PatientResponseDTO;
import com.pm.patientservice.exception.EmailAlreadyExistException;
import com.pm.patientservice.exception.PatientNotFoundException;
import com.pm.patientservice.grpc.BillingServiceGrpcClient;
import com.pm.patientservice.model.Patient;
import com.pm.patientservice.repository.PatientRepository;
import com.pm.patientservice.utilsMapper.PatientMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class PatientService {
    private final PatientRepository patientRepository;
    private final BillingServiceGrpcClient billingServiceGrpcClient;

    public PatientService(PatientRepository patientRepository, BillingServiceGrpcClient billingServiceGrpcClient){
        this.patientRepository = patientRepository;
        this.billingServiceGrpcClient = billingServiceGrpcClient;
    }

    public List<PatientResponseDTO> getPatients(){
        List<Patient> patients = patientRepository.findAll();

        return patients.stream().map(PatientMapper::mapPatienttoPatientResponseDTO).toList();
    }

    public PatientResponseDTO createPatient(PatientRequestDTO patientRequestDTO){

        if(patientRepository.existsByEmail(patientRequestDTO.getEmail())){
            throw new EmailAlreadyExistException("A Patient with this Email " + patientRequestDTO.getEmail() + " Address Already Exists");
        }

        Patient newPatient = PatientMapper.mapPatientRequestDTOtoPatient(patientRequestDTO);
        patientRepository.save(newPatient);

        billingServiceGrpcClient.createBillingAccount(newPatient.getId().toString(),
                newPatient.getName(),newPatient.getEmail());

        return PatientMapper.mapPatienttoPatientResponseDTO(newPatient);
    }

    public PatientResponseDTO updatePatient(UUID Id,PatientRequestDTO patientRequestDTO){

        Patient patient = patientRepository.findById(Id).orElseThrow(
                () -> new PatientNotFoundException("Patient with id "+Id+" Not Found")
        );

        // Is there any duplicate record exist with this same email except the current record which we want to update
        // We want this as we want to keep our email to be unique
        if(patientRepository.existsByEmailAndIdNot(patientRequestDTO.getEmail(),Id)){
            throw new EmailAlreadyExistException("A Patient with this Email " + patientRequestDTO.getEmail() + " Address Already Exists");
        }

        patient.setName(patientRequestDTO.getName());
        patient.setAddress(patientRequestDTO.getAddress());
        patient.setEmail(patientRequestDTO.getEmail());
        patient.setDateofBirth(LocalDate.parse(patientRequestDTO.getDateofBirth()));

        Patient updatedPatient = patientRepository.save(patient);
        return PatientMapper.mapPatienttoPatientResponseDTO(updatedPatient);
    }

    public PatientResponseDTO deletePatient(UUID Id){
        Patient patient = patientRepository.findById(Id).orElseThrow(
                () -> new PatientNotFoundException("Patient with id "+Id+" Not Found")
        );
        patientRepository.delete(patient);
        return PatientMapper.mapPatienttoPatientResponseDTO(patient);
    }
}
