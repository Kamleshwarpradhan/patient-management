package com.pm.appointmentService.feign;

import com.pm.appointmentService.dto.DoctorDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "doctor-service", url = "${doctor-service.url}")
public interface DoctorServiceClient {

    // Calls GET http://doctor-service:8086/doctors
    // Returns list of all doctors (role=USER)
    @GetMapping("/doctors")
    List<DoctorDTO> getAllDoctors();

    // Calls GET http://doctor-service:8086/doctors/by-specialty?specialty=Cardiology
    @GetMapping("/doctors/by-specialty")
    List<DoctorDTO> getDoctorsBySpecialty(@RequestParam("specialty") String specialty);

    @GetMapping("/doctor")
    DoctorDTO getDoctorByEmail(@RequestParam("email") String doctorEmail);
}
