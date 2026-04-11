package com.pm.appointmentService.repository;

import com.pm.appointmentService.model.Appointment;
import com.pm.appointmentService.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    List<Appointment> findByDoctorEmailAndStatus(String doctorEmail, AppointmentStatus appointmentStatus);

    List<Appointment> findByDoctorEmail(String doctorEmail);

    List<Appointment> findByPatientEmail(String patientEmail);
}
