package com.pm.appointmentService.dto;

import java.util.UUID;

public class AppointmentResponseDTO {

    private UUID appointmentId;
    private String predictedSpecialty;
    private String assignedDoctorName;
    private String assignedDoctorEmail;
    private String status;
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UUID getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(UUID appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getPredictedSpecialty() {
        return predictedSpecialty;
    }

    public void setPredictedSpecialty(String predictedSpecialty) {
        this.predictedSpecialty = predictedSpecialty;
    }

    public String getAssignedDoctorName() {
        return assignedDoctorName;
    }

    public void setAssignedDoctorName(String assignedDoctorName) {
        this.assignedDoctorName = assignedDoctorName;
    }

    public String getAssignedDoctorEmail() {
        return assignedDoctorEmail;
    }

    public void setAssignedDoctorEmail(String assignedDoctorEmail) {
        this.assignedDoctorEmail = assignedDoctorEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
