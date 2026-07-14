package com.pm.doctorService.mapper;

import com.pm.doctorService.dto.DoctorResponseDTO;
import com.pm.doctorService.model.Doctor;

public class DoctorMapper {

    public static DoctorResponseDTO mapDoctorToDoctorResponseDTO(Doctor doctor){
        return new DoctorResponseDTO(
                doctor.getId().toString(),
                doctor.getName(),
                doctor.getEmail(),
                "DOCTOR",
                doctor.getSpecialty(),
                doctor.getExperienceYears(),
                doctor.getClinicAddress(),
                doctor.getConsultationFee() != null ? doctor.getConsultationFee() : java.math.BigDecimal.valueOf(500)
        );
    }
}
