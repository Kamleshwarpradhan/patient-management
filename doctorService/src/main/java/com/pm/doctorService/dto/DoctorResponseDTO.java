package com.pm.doctorService.dto;

public class DoctorResponseDTO {
    private String id;
    private String name;
    private String email;
    private String role;
    private String specialty;
    private Integer experienceYears;
    private String clinicAddress;

    public DoctorResponseDTO() {}

    public DoctorResponseDTO(String id, String name, String email, String role,
                             String specialty, Integer experienceYears, String clinicAddress) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.specialty = specialty;
        this.experienceYears = experienceYears;
        this.clinicAddress = clinicAddress;
    }
    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getClinicAddress() {
        return clinicAddress;
    }

    public void setClinicAddress(String clinicAddress) {
        this.clinicAddress = clinicAddress;
    }
}
