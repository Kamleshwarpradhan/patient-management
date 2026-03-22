package com.pm.appointmentService.controller;

import com.pm.appointmentService.dto.AppointmentRequestDTO;
import com.pm.appointmentService.dto.AppointmentResponseDTO;
import com.pm.appointmentService.model.Appointment;
import com.pm.appointmentService.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    /**
     * Patient books an appointment.
     * Headers: X-User-Email (forwarded by Gateway)
     */
    @PostMapping("/book")
    public ResponseEntity<AppointmentResponseDTO> book(
            @RequestBody AppointmentRequestDTO request,
            @RequestHeader("X-User-Email") String patientEmail) {
        AppointmentResponseDTO response = appointmentService
                .bookAppointment(request, patientEmail);
        return ResponseEntity.ok(response);
    }
    /**
     * Doctor views pending appointment requests.
     * Headers: X-User-Email (forwarded by Gateway)
     */
    @GetMapping("/pending")
    public ResponseEntity<List<Appointment>> getPending(
            @RequestHeader("X-User-Email") String doctorEmail) {
        return ResponseEntity.ok(
                appointmentService.getPendingForDoctor(doctorEmail));
    }
    
    /**
     * Patient views their own appointments.
     * Headers: X-User-Email (forwarded by Gateway)
     */
    @GetMapping("/patient")
    public ResponseEntity<List<Appointment>> getPatientAppointments(
            @RequestHeader("X-User-Email") String patientEmail) {
        return ResponseEntity.ok(
                appointmentService.getAppointmentsForPatient(patientEmail));
    }
    
    /**
     * Doctor fetches their appointment stats.
     */
    @GetMapping("/doctor/stats")
    public ResponseEntity<Map<String, Long>> getDoctorStats(
            @RequestHeader("X-User-Email") String doctorEmail) {
        return ResponseEntity.ok(appointmentService.getDoctorStats(doctorEmail));
    }
    
    /**
     * Doctor confirms or rejects an appointment.
     * Body: { "status": "CONFIRMED" } or { "status": "REJECTED" }
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body,
            @RequestHeader("X-User-Email") String doctorEmail) {
        Appointment updated = appointmentService
                .updateStatus(id, body.get("status"), doctorEmail);
        return ResponseEntity.ok(updated);
    }
}
