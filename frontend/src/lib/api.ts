import { 
  Patient, PatientRequest, LoginRequest, LoginResponse, 
  RegisterRequest, Doctor, AppointmentRequestDTO, 
  AppointmentResponseDTO, AppointmentModel 
} from "@/types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088";

class ApiClient {
    private getToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("auth_token");
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = this.getToken();
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        if (token) {
            (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("auth_token");
                window.location.href = "/login";
            }
            throw new Error("Unauthorized");
        }

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(errorBody || `HTTP Error ${response.status}`);
        }

        // Handle empty responses (204, etc.)
        const contentLength = response.headers.get("content-length");
        if (response.status === 204 || contentLength === "0") {
            return {} as T;
        }

        return response.json();
    }

    // Auth endpoints
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        return this.request<LoginResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        });
    }

    async register(data: RegisterRequest): Promise<void> {
        return this.request<void>("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async registerPatient(data: RegisterRequest): Promise<void> {
        return this.request<void>("/auth/register-patient", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    // User/Doctor endpoints
    async getDoctors(): Promise<Doctor[]> {
        return this.request<Doctor[]>("/auth/users");
    }

    async getDoctorCount(): Promise<{ doctors: number }> {
        return this.request<{ doctors: number }>("/auth/users/count");
    }

    async updateSpecialty(specialty: string): Promise<void> {
        return this.request<void>("/auth/user/specialty", {
            method: "PUT",
            body: JSON.stringify({ specialty }),
        });
    }

    // Patient endpoints
    async getPatients(): Promise<Patient[]> {
        return this.request<Patient[]>("/api/patient");
    }

    async createPatient(data: PatientRequest): Promise<Patient> {
        return this.request<Patient>("/api/patient", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updatePatient(id: string, data: PatientRequest): Promise<Patient> {
        return this.request<Patient>(`/api/patient/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async deletePatient(id: string): Promise<Patient> {
        return this.request<Patient>(`/api/patient/${id}`, {
            method: "DELETE",
        });
    }

    // Appointment endpoints
    async bookAppointment(data: AppointmentRequestDTO): Promise<AppointmentResponseDTO> {
        return this.request<AppointmentResponseDTO>("/api/appointments/book", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async getPendingAppointments(): Promise<AppointmentModel[]> {
        return this.request<AppointmentModel[]>("/api/appointments/pending");
    }

    async getPatientAppointments(): Promise<AppointmentModel[]> {
        return this.request<AppointmentModel[]>("/api/appointments/patient");
    }

    async getDoctorStats(): Promise<{ totalPatients: number }> {
        return this.request<{ totalPatients: number }>("/api/appointments/doctor/stats");
    }

    async updateAppointmentStatus(id: string, status: "CONFIRMED" | "REJECTED" | "CANCELED"): Promise<AppointmentModel> {
        return this.request<AppointmentModel>(`/api/appointments/${id}/status`, {
            method: "PUT",
            body: JSON.stringify({ status }),
        });
    }
}

export const apiClient = new ApiClient();
