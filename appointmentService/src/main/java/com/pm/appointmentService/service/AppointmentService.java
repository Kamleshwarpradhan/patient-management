package com.pm.appointmentService.service;

import com.pm.appointmentService.dto.AppointmentRequestDTO;
import com.pm.appointmentService.dto.AppointmentResponseDTO;
import com.pm.appointmentService.dto.DoctorDTO;
import com.pm.appointmentService.feign.AuthServiceClient;
import com.pm.appointmentService.kafka.AppointmentEventProducer;
import com.pm.appointmentService.model.Appointment;
import com.pm.appointmentService.model.AppointmentStatus;
import com.pm.appointmentService.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final SymptomAnalyzerService symptomAnalyzer;
    private final AuthServiceClient authServiceClient;
    private final AppointmentEventProducer eventProducer;

    public AppointmentService(AppointmentRepository appointmentRepository, SymptomAnalyzerService symptomAnalyzer,
            AuthServiceClient authServiceClient, AppointmentEventProducer eventProducer) {
        this.appointmentRepository = appointmentRepository;
        this.symptomAnalyzer = symptomAnalyzer;
        this.authServiceClient = authServiceClient;
        this.eventProducer = eventProducer;
    }

    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO request,
            String patientEmail) {
        // 1. Analyze symptoms
        String specialty = symptomAnalyzer.analyzeSymptoms(request.getSymptoms());
        // 2. Find a doctor with that specialty (targeted query first)
        List<DoctorDTO> matchingDoctors = authServiceClient.getDoctorsBySpecialty(specialty);
        DoctorDTO matchedDoctor;

        if (!matchingDoctors.isEmpty()) {
            matchedDoctor = matchingDoctors.get(0);
        } else {
            // Fallback: assign to any available doctor
            List<DoctorDTO> allDoctors = authServiceClient.getAllDoctors();
            matchedDoctor = allDoctors.isEmpty() ? null : allDoctors.get(0);
        }

        if (matchedDoctor == null) {
            AppointmentResponseDTO resp = new AppointmentResponseDTO();
            resp.setStatus("FAILED");
            resp.setMessage("No doctors available at this time.");
            return resp;
        }
        // 3. Create appointment
        Appointment appointment = new Appointment();
        appointment.setPatientEmail(patientEmail);
        appointment.setDoctorEmail(matchedDoctor.getEmail());
        appointment.setDoctorId(UUID.fromString(matchedDoctor.getId()));
        appointment.setSymptoms(request.getSymptoms());
        appointment.setPredictedSpecialty(specialty);
        appointment.setStatus(AppointmentStatus.PENDING);
        if (request.getPreferredTime() != null
                && !request.getPreferredTime().isEmpty()) {
            appointment.setAppointmentTime(
                    LocalDateTime.parse(request.getPreferredTime()));
        }
        appointmentRepository.save(appointment);
        // 4. Publish Kafka event (Notification Service will consume this)
        eventProducer.sendAppointmentCreated(
                appointment.getId().toString(),
                patientEmail,
                matchedDoctor.getEmail(),
                request.getSymptoms(),
                specialty);
        // 5. Build response
        AppointmentResponseDTO response = new AppointmentResponseDTO();
        response.setAppointmentId(appointment.getId());
        response.setPredictedSpecialty(specialty);
        response.setAssignedDoctorName(matchedDoctor.getName());
        response.setAssignedDoctorEmail(matchedDoctor.getEmail());
        response.setStatus("PENDING");
        response.setMessage("We think you need a " + specialty
                + " specialist. Dr. " + matchedDoctor.getName()
                + " has been notified!");
        return response;
    }

    public List<Appointment> getPendingForDoctor(String doctorEmail) {
        return appointmentRepository.findByDoctorEmailAndStatus(
                doctorEmail, AppointmentStatus.PENDING);
    }

    public List<Appointment> getAppointmentsForPatient(String patientEmail) {
        return appointmentRepository.findByPatientEmail(patientEmail);
    }

    public Map<String, Long> getDoctorStats(String doctorEmail) {
        long confirmedPatients = appointmentRepository.findByDoctorEmailAndStatus(doctorEmail, AppointmentStatus.CONFIRMED).stream()
                .map(Appointment::getPatientEmail)
                .distinct()
                .count();
        return Map.of("totalPatients", confirmedPatients);
    }

    public Appointment updateStatus(UUID appointmentId, String newStatus,
            String doctorEmail) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        if (!appt.getDoctorEmail().equals(doctorEmail)) {
            throw new RuntimeException("Not your appointment");
        }
        AppointmentStatus status = AppointmentStatus.valueOf(newStatus.toUpperCase());
        appt.setStatus(status);
        appointmentRepository.save(appt);

        if (status == AppointmentStatus.CONFIRMED) {
            eventProducer.sendAppointmentConfirmed(
                    appt.getId().toString(),
                    appt.getPatientEmail(),
                    doctorEmail,
                    "Doctor" // In real app, fetch doctor name
            );
        }
        return appt;
    }
}
