package com.pm.doctorService.service;

import com.pm.doctorService.dto.DoctorResponseDTO;
import com.pm.doctorService.mapper.DoctorMapper;
import com.pm.doctorService.model.Doctor;
import com.pm.doctorService.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<DoctorResponseDTO> getAllDoctors(){
        return doctorRepository.findAll().stream()
                .map(DoctorMapper::mapDoctorToDoctorResponseDTO).toList();
    }

    public List<DoctorResponseDTO> getDoctorsBySpecialty(String specialty){
        return doctorRepository.findBySpecialty(specialty).stream()
                .map(DoctorMapper::mapDoctorToDoctorResponseDTO).toList();
    }

    public Optional<DoctorResponseDTO> getDoctorByEmail(String email){
        return doctorRepository.findByEmail(email).map(DoctorMapper::mapDoctorToDoctorResponseDTO);
    }

    public Optional<DoctorResponseDTO> updateDoctorProfile(String email,String specialty,Integer experienceYears,String clinicAddress){
        return doctorRepository.findByEmail(email).map(doctor -> {
            if (specialty != null) doctor.setSpecialty(specialty);
            if (experienceYears != null) doctor.setExperienceYears(experienceYears);
            if (clinicAddress != null) doctor.setClinicAddress(clinicAddress);
            doctorRepository.save(doctor);
            return DoctorMapper.mapDoctorToDoctorResponseDTO(doctor);
        });
    }
}
