package com.pm.patientservice.services;

import com.pm.patientservice.dto.PatientRequestDTO;
import com.pm.patientservice.dto.PatientResponseDTO;
import com.pm.patientservice.exception.EmailAlreadyExistException;
import com.pm.patientservice.exception.PatientNotFoundException;
import com.pm.patientservice.grpc.BillingServiceGrpcClient;
import com.pm.patientservice.model.Patient;
import com.pm.patientservice.repository.PatientRepository;
import com.pm.patientservice.utilsMapper.PatientMapper;
import com.pm.patientservice.kafka.kafkaproducer;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class PatientService {
    private final PatientRepository patientRepository;
    private final BillingServiceGrpcClient billingServiceGrpcClient;
    private final kafkaproducer kafkaProducer;

    public PatientService(PatientRepository patientRepository, BillingServiceGrpcClient billingServiceGrpcClient,
            kafkaproducer kafkaProducer1) {
        this.patientRepository = patientRepository;
        this.billingServiceGrpcClient = billingServiceGrpcClient;
        this.kafkaProducer = kafkaProducer1;
    }

    public List<PatientResponseDTO> getPatients() {
        List<Patient> patients = patientRepository.findAll();
        return patients.stream().map(PatientMapper::mapPatienttoPatientResponseDTO).toList();
    }

    public List<PatientResponseDTO> getPatientsByDoctor(String doctorEmail) {
        List<Patient> patients = patientRepository.findByDoctorEmail(doctorEmail);
        return patients.stream().map(PatientMapper::mapPatienttoPatientResponseDTO).toList();
    }

    public PatientResponseDTO createPatient(PatientRequestDTO patientRequestDTO, String doctorEmail) {

        if (patientRepository.existsByEmail(patientRequestDTO.getEmail())) {
            throw new EmailAlreadyExistException(
                    "A Patient with this Email " + patientRequestDTO.getEmail() + " Address Already Exists");
        }

        Patient newPatient = PatientMapper.mapPatientRequestDTOtoPatient(patientRequestDTO);
        newPatient.setDoctorEmail(doctorEmail);
        patientRepository.save(newPatient);

        billingServiceGrpcClient.createBillingAccount(newPatient.getId().toString(),
                newPatient.getName(), newPatient.getEmail());

        kafkaProducer.sendEvent(newPatient);
        return PatientMapper.mapPatienttoPatientResponseDTO(newPatient);
    }

    public PatientResponseDTO updatePatient(UUID Id, PatientRequestDTO patientRequestDTO, String doctorEmail,
            String userRole) {

        Patient patient = patientRepository.findById(Id).orElseThrow(
                () -> new PatientNotFoundException("Patient with id " + Id + " Not Found"));

        // Ownership check: only the assigned doctor or ADMIN can update
        if (!"ADMIN".equals(userRole) && !patient.getDoctorEmail().equals(doctorEmail)) {
            throw new PatientNotFoundException("Patient with id " + Id + " Not Found");
        }

        if (patientRepository.existsByEmailAndIdNot(patientRequestDTO.getEmail(), Id)) {
            throw new EmailAlreadyExistException(
                    "A Patient with this Email " + patientRequestDTO.getEmail() + " Address Already Exists");
        }

        patient.setName(patientRequestDTO.getName());
        patient.setAddress(patientRequestDTO.getAddress());
        patient.setEmail(patientRequestDTO.getEmail());
        patient.setDateofBirth(LocalDate.parse(patientRequestDTO.getDateofBirth()));

        Patient updatedPatient = patientRepository.save(patient);
        return PatientMapper.mapPatienttoPatientResponseDTO(updatedPatient);
    }

    public PatientResponseDTO deletePatient(UUID Id, String doctorEmail, String userRole) {
        Patient patient = patientRepository.findById(Id).orElseThrow(
                () -> new PatientNotFoundException("Patient with id " + Id + " Not Found"));

        // Ownership check: only the assigned doctor or ADMIN can delete
        if (!"ADMIN".equals(userRole) && !patient.getDoctorEmail().equals(doctorEmail)) {
            throw new PatientNotFoundException("Patient with id " + Id + " Not Found");
        }

        patientRepository.delete(patient);
        return PatientMapper.mapPatienttoPatientResponseDTO(patient);
    }
}
