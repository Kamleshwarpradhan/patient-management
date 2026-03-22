package com.pm.appointmentService.feign;

import com.pm.appointmentService.dto.DoctorDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "auth-service", url = "${auth-service.url}")
public interface AuthServiceClient {

    // Calls GET http://localhost:8083/doctors
    // Returns list of all doctors (role=USER)
    @GetMapping("/doctors")
    List<DoctorDTO> getAllDoctors();

    // Calls GET http://localhost:8083/doctors/by-specialty?specialty=Cardiology
    @GetMapping("/doctors/by-specialty")
    List<DoctorDTO> getDoctorsBySpecialty(@RequestParam("specialty") String specialty);
}
