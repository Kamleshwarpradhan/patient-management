package com.pm.authService.dto;

public class UserResponseDTO {
    private String id;
    private String name;
    private String email;
    private String role;
    private String specialty;

    public UserResponseDTO() {
    }

    public UserResponseDTO(String id, String name, String email, String role, String specialty) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.specialty = specialty;
    }

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
}
