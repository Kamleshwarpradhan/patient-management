package com.pm.doctorService.controller;

import com.pm.doctorService.dto.DoctorResponseDTO;
import com.pm.doctorService.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @Operation(summary = "List all doctors")
    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorResponseDTO>> getAllDoctors(){
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @Operation(summary = "Find doctor by specialty")
    @GetMapping("/doctors/by-specialty")
    public ResponseEntity<List<DoctorResponseDTO>> getDoctorsBySpecialty(@RequestParam("specialty") String specialty){
        return ResponseEntity.ok(doctorService.getDoctorsBySpecialty(specialty));
    }

    @Operation(summary = "Find doctor by email")
    @GetMapping("/doctor")
    public ResponseEntity<DoctorResponseDTO> getDoctorByEmail(@RequestParam("email") String email){
        return doctorService.getDoctorByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get current doctor profile")
    @GetMapping("/doctor/me")
    public ResponseEntity<DoctorResponseDTO> getMyProfile(@RequestHeader("X-User-Email") String email){
        return doctorService.getDoctorByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Update doctor profile")
    @PutMapping("/doctor/me")
    public ResponseEntity<DoctorResponseDTO> updateMyProfile(
            @RequestHeader("X-User-Email") String email,
            @RequestBody Map<String,Object> payload
            ){
        String specialty = payload.get("specialty") != null
                ? payload.get("specialty").toString() : null;
        Integer experience = payload.get("experienceYears") != null
                ? ((Number) payload.get("experienceYears")).intValue() : null;
        String clinicAddress = payload.get("clinicAddress") != null
                ? payload.get("clinicAddress").toString() : null;

        return doctorService.updateDoctorProfile(email, specialty, experience, clinicAddress)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
