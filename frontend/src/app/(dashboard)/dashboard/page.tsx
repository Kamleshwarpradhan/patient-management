"use client";

import { useEffect, useState } from "react";
import { ScheduleCalendar } from "@/components/dashboard/schedule-calendar";
import { PatientsTodayList } from "@/components/dashboard/patients-today";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PatientsChart } from "@/components/dashboard/patients-chart";
import { WorkingHoursChart } from "@/components/dashboard/working-hours-chart";
import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { PatientAppointmentsTable } from "@/components/dashboard/patient-appointments-table";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
    const { user } = useAuth();
    const [patientCount, setPatientCount] = useState(0);
    const [doctorCount, setDoctorCount] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (user?.role === "USER") {
            apiClient.getDoctorStats()
                .then((data) => setPatientCount(data.totalPatients))
                .catch(() => { });
        } else if (user?.role === "ADMIN") {
            apiClient.getPatients()
                .then((patients) => setPatientCount(patients.length))
                .catch(() => { });
        }

        // If ADMIN, fetch doctor count
        if (user?.role === "ADMIN") {
            apiClient
                .getDoctorCount()
                .then((data) => {
                    setDoctorCount(data.doctors);
                })
                .catch(() => {
                    setDoctorCount(0);
                });
        }
    }, [user]);

    if (user?.role === "PATIENT") {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-2">
                    <h1 className="text-3xl font-bold tracking-tight">Patient Dashboard</h1>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    <PatientAppointmentsTable />
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-[300px_1fr] gap-6">
            {/* Left Column — Calendar + Patients Today */}
            <div className="space-y-5">
                <ScheduleCalendar />
                <PatientsTodayList />
            </div>

            {/* Right Column — Main Content */}
            <div className="space-y-5">
                {/* Stats Row */}
                <StatsCards patientCount={patientCount} doctorCount={doctorCount} />

                {/* Charts Row */}
                <div className="grid grid-cols-[2fr_1fr] gap-5">
                    <PatientsChart />
                    <WorkingHoursChart />
                </div>

                {/* Appointments Table */}
                <AppointmentsTable />
            </div>
        </div>
    );
}
