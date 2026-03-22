// Patient types matching backend DTOs
export interface Patient {
  id: string;
  name: string;
  email: string;
  address: string;
  dateOfBirth: string;
  doctorEmail?: string;
}

export interface PatientRequest {
  name: string;
  email: string;
  address: string;
  dateofBirth: string;
  registeredDate: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Doctor/User types for admin
export interface Doctor {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Dashboard types
export interface Appointment {
  id: string;
  patientName: string;
  initials: string;
  status: "First visit" | "Follow-up" | "Discharge summary";
  date: string;
  time: string;
  payment: "Paid" | "Pending";
}

export interface PatientToday {
  id: string;
  name: string;
  initials: string;
  condition: string;
  time: string;
  avatarColor?: string;
  hasCheckmark?: boolean;
}

export interface MonthlyData {
  month: string;
  recovered: number;
}

export interface WorkingHoursData {
  name: string;
  value: number;
  color: string;
}

// Backend Appointment Types
export interface AppointmentRequestDTO {
  symptoms: string;
  preferredTime?: string;
}

export interface AppointmentResponseDTO {
  appointmentId: string;
  predictedSpecialty: string;
  assignedDoctorName: string;
  assignedDoctorEmail: string;
  status: string;
  message: string;
}

export interface AppointmentModel {
  id: string;
  patientEmail: string;
  doctorEmail: string;
  doctorId: string;
  symptoms: string;
  predictedSpecialty: string;
  appointmentTime?: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELED";
  createdAt: string;
}
