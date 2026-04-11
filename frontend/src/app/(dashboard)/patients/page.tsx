"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Mail,
    MapPin,
    Calendar,
    Users,
    Stethoscope,
    ActivitySquare,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { Patient, AppointmentModel } from "@/types/types";
import { PatientDialog } from "@/components/patients/patient-dialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

const avatarColors = [
    "bg-blue-500",
    "bg-amber-500",
    "bg-purple-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-orange-500",
];

export default function PatientsPage() {
    const { user } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctorAppointments, setDoctorAppointments] = useState<AppointmentModel[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

    const fetchPatients = async () => {
        try {
            setIsLoading(true);
            if (user?.role === "ADMIN") {
                const data = await apiClient.getPatients();
                setPatients(data);
            } else if (user?.role === "USER") {
                // Doctor views logic
                const appts = await apiClient.getDoctorAppointments();
                setDoctorAppointments(appts);
                
                // Construct pseudo-patient models from appointment data to fit the UI gracefully
                const distinctPatients = new Map<string, Patient>();
                appts.forEach(appt => {
                    if (appt.status === "CONFIRMED" && !distinctPatients.has(appt.patientEmail)) {
                        distinctPatients.set(appt.patientEmail, {
                            id: appt.id,
                            name: appt.patientEmail.split("@")[0].toUpperCase(),
                            email: appt.patientEmail,
                            address: "Digital Consultation",
                            dateOfBirth: "Unknown (System User)"
                        });
                    }
                });
                
                setPatients(Array.from(distinctPatients.values()));
            }
        } catch {
            // API might not be available
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchPatients();
        }
    }, [user]);

    const handleDelete = async (id: string) => {
        try {
            await apiClient.deletePatient(id);
            setPatients((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Failed to delete patient:", error);
        }
    };

    const handleEdit = (patient: Patient) => {
        setEditingPatient(patient);
        setDialogOpen(true);
    };

    const handleAdd = () => {
        setEditingPatient(null);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditingPatient(null);
    };

    const filteredPatients = patients.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{user?.role === "ADMIN" ? "Global Patient Records" : "My Verified Patients"}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {user?.role === "ADMIN" ? "Manage global unmapped patient registries" : "View your assigned and scheduled patients in one place"}
                    </p>
                </div>
                {user?.role === "ADMIN" && (
                    <Button
                        onClick={handleAdd}
                        className="gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Add Patient
                    </Button>
                )}
            </div>

            {/* Search & Stats */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search patients by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 rounded-xl border-border/50 bg-card shadow-sm"
                    />
                </div>
                <Badge
                    variant="outline"
                    className="gap-1.5 rounded-lg border-blue-200 bg-blue-50 px-3 py-1.5 text-blue-700"
                >
                    <Users className="h-3.5 w-3.5" />
                    {patients.length} Total
                </Badge>
            </div>

            {/* Patient Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="border-border/40 animate-pulse">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-11 w-11 rounded-full bg-muted" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-32 rounded bg-muted" />
                                        <div className="h-3 w-24 rounded bg-muted" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-full rounded bg-muted" />
                                    <div className="h-3 w-3/4 rounded bg-muted" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredPatients.length === 0 ? (
                <Card className="border-border/40 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
                            <Users className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <p className="text-lg font-medium mb-1">{user?.role === "USER" ? "No Confirmed Patients Yet" : "No patients found"}</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            {search
                                ? "Try adjusting your search terms"
                                : user?.role === "USER" ? "Accept an appointment request to see your patient details here." : "Get started by adding your first patient"}
                        </p>
                        {!search && user?.role === "ADMIN" && (
                            <Button onClick={handleAdd} variant="outline" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Patient
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPatients.map((patient, index) => (
                        <Card
                            key={patient.id}
                            className="group border-border/40 shadow-sm hover:shadow-md transition-all hover:border-blue-200/50"
                        >
                            <CardContent className="p-5">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-11 w-11">
                                            <AvatarFallback
                                                className={cn(
                                                    "text-sm font-semibold text-white",
                                                    avatarColors[index % avatarColors.length]
                                                )}
                                            >
                                                {patient.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .toUpperCase()
                                                    .slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-sm">{patient.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                ID: {patient.id.slice(0, 8)}...
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {user?.role === "ADMIN" && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                                    onClick={() => handleEdit(patient)}
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(patient.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </>
                                        )}
                                        {user?.role === "USER" && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50"
                                            >
                                                <ActivitySquare className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="h-3.5 w-3.5 shrink-0" />
                                        <span className="truncate">{patient.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                                        <span className="truncate">{patient.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                                        <span>DOB: {patient.dateOfBirth}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Dialog */}
            <PatientDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                onSuccess={fetchPatients}
                patient={editingPatient}
            />
        </div>
    );
}
