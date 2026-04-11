"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api";
import { Doctor, Patient } from "@/types/types";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Users, Stethoscope, Activity, Trash2, ShieldAlert } from "lucide-react";

export default function AdminDashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [totalAppointments, setTotalAppointments] = useState(0);

    /* Enforce Admin only */
    useEffect(() => {
        if (!isLoading && user && user.role !== "ADMIN") {
            router.push("/dashboard");
        }
    }, [user, isLoading, router]);

    const fetchData = async () => {
        try {
            const [docs, pats] = await Promise.all([
                apiClient.getDoctors(),
                apiClient.getPatients()
            ]);
            setDoctors(docs);
            setPatients(pats);
            // Rough metrics
            setTotalAppointments(pats.length * 2); // mockup total platform activity
        } catch (error) {
            console.error("Failed to load admin data", error);
        }
    };

    useEffect(() => {
        if (user?.role === "ADMIN") {
            fetchData();
        }
    }, [user]);

    const handleDeleteDoctor = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete Doctor ${name}? This action cannot be undone.`)) {
            await apiClient.deleteUser(id);
            await fetchData();
        }
    };

    const handleDeletePatient = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete Patient ${name}?`)) {
            await apiClient.deletePatient(id);
            await fetchData();
        }
    };

    if (isLoading || user?.role !== "ADMIN") return null;

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Admin Console</h2>
                    <p className="text-muted-foreground mt-1 text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full inline-flex items-center gap-1.5 font-medium">
                        <ShieldAlert className="w-3.5 h-3.5" /> Superuser Access
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <span className="text-emerald-500 text-lg font-bold">₹</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalAppointments * 500}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Registered Doctors</CardTitle>
                        <Stethoscope className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{doctors.length}</div>
                        <p className="text-xs text-muted-foreground">+2 active accounts</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Registered Patients</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{patients.length}</div>
                        <p className="text-xs text-muted-foreground">+5 this week</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-border/50 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white/90">Platform Activity</CardTitle>
                        <Activity className="h-4 w-4 text-white/70" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalAppointments} Appointments</div>
                        <p className="text-xs text-white/70">Processed over 30 days</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="doctors" className="space-y-4">
                <TabsList className="bg-muted w-[300px] grid grid-cols-2 p-1 border border-border/50">
                    <TabsTrigger value="doctors" className="font-medium">Manage Doctors</TabsTrigger>
                    <TabsTrigger value="patients" className="font-medium">Manage Patients</TabsTrigger>
                </TabsList>
                <TabsContent value="doctors" className="space-y-4 animate-in fade-in duration-300">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle>Doctor Directory</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50 text-left font-medium text-muted-foreground">
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4">Specialty</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {doctors.length === 0 ? (
                                            <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No doctors found.</td></tr>
                                        ) : doctors.map((doc) => (
                                            <tr key={doc.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                                <td className="p-4 font-medium">{doc.name}</td>
                                                <td className="p-4 text-muted-foreground">{doc.email}</td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                                                        {doc.specialty || "Unassigned"}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => handleDeleteDoctor(doc.id, doc.name)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="patients" className="space-y-4 animate-in fade-in duration-300">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle>Patient Directory</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50 text-left font-medium text-muted-foreground">
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patients.length === 0 ? (
                                            <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">No patients found.</td></tr>
                                        ) : patients.map((pat) => (
                                            <tr key={pat.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                                <td className="p-4 font-medium">{pat.name}</td>
                                                <td className="p-4 text-muted-foreground">{pat.email}</td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => handleDeletePatient(pat.id, pat.name)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
