package com.pm.patientservice.controller;

import com.pm.patientservice.dto.PatientRequestDTO;
import com.pm.patientservice.dto.PatientResponseDTO;
import com.pm.patientservice.dto.Validator.CreatePatientValidatorGroups;
import com.pm.patientservice.model.Patient;
import com.pm.patientservice.repository.PatientRepository;
import com.pm.patientservice.services.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.groups.Default;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/patient")
@Tag(name = "Patient", description = "API for managing patients")
public class PatientController {

    private final PatientService patientService;
    private final PatientRepository patientRepository;

    public PatientController(PatientService patientService, PatientRepository patientRepository) {
        this.patientService = patientService;
        this.patientRepository = patientRepository;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current patient's own profile")
    public ResponseEntity<Patient> getMyProfile(@RequestHeader("X-User-Email") String email) {
        return patientRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    @Operation(summary = "Update current patient's address (DOB is read-only)")
    public ResponseEntity<Patient> updateMyProfile(
            @RequestHeader("X-User-Email") String email,
            @RequestBody Map<String, String> payload) {
        return patientRepository.findByEmail(email)
                .map(patient -> {
                    if (payload.containsKey("address")) {
                        patient.setAddress(payload.get("address"));
                    }
                    return ResponseEntity.ok(patientRepository.save(patient));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @Operation(summary = "Get patients — scoped by role (ADMIN sees all, doctors see their own)")
    public ResponseEntity<List<PatientResponseDTO>> getPatients(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {

        List<PatientResponseDTO> patientResponse;

        if ("ADMIN".equals(userRole)) {
            // Admin can see all patients
            patientResponse = patientService.getPatients();
        } else {
            // Doctor sees only their own patients
            patientResponse = patientService.getPatientsByDoctor(userEmail);
        }

        return ResponseEntity.ok().body(patientResponse);
    }

    @PostMapping
    @Operation(summary = "Create a new Patient — automatically assigned to the requesting doctor")
    public ResponseEntity<PatientResponseDTO> createPatient(
            @Validated({ Default.class,
                    CreatePatientValidatorGroups.class }) @RequestBody PatientRequestDTO patientRequestDTO,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail) {

        PatientResponseDTO patientResponseDTO = patientService.createPatient(patientRequestDTO, userEmail);
        return ResponseEntity.ok().body(patientResponseDTO);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a Patient — only by assigned doctor or ADMIN")
    public ResponseEntity<PatientResponseDTO> updatePatient(
            @PathVariable UUID id,
            @Validated({ Default.class }) @RequestBody PatientRequestDTO patientRequestDTO,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {

        PatientResponseDTO patientResponseDTO = patientService.updatePatient(id, patientRequestDTO, userEmail,
                userRole);
        return ResponseEntity.ok().body(patientResponseDTO);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a patient — only by assigned doctor or ADMIN")
    public ResponseEntity<PatientResponseDTO> deletePatient(
            @PathVariable UUID id,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {

        PatientResponseDTO patientResponseDTO = patientService.deletePatient(id, userEmail, userRole);
        return ResponseEntity.ok().body(patientResponseDTO);
    }
}
