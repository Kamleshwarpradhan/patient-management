"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api";
import { AppointmentModel } from "@/types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Loader2, CalendarClock } from "lucide-react";

export default function AppointmentRequestsPage() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<AppointmentModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (user && user.role !== "PATIENT") {
            fetchPendingAppointments();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const fetchPendingAppointments = async () => {
        try {
            const data = await apiClient.getPendingAppointments();
            setAppointments(data);
        } catch (error) {
            console.error("Failed to fetch pending appointments", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id: string, status: "CONFIRMED" | "REJECTED") => {
        setActionLoading(id);
        try {
            await apiClient.updateAppointmentStatus(id, status);
            // Remove the processed appointment from the list
            setAppointments((prev) => prev.filter((appt) => appt.id !== id));
        } catch (error) {
            console.error(`Failed to ${status} appointment:`, error);
            alert("An error occurred while updating the status.");
        } finally {
            setActionLoading(null);
        }
    };

    if (user && user.role === "PATIENT") {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-destructive">Access Denied</CardTitle>
                        <CardDescription>Only doctors can view appointment requests.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <CalendarClock className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Appointment Requests</h1>
            </div>

            <Card className="shadow-sm border-primary/10">
                <CardHeader>
                    <CardTitle>Pending Inbox</CardTitle>
                    <CardDescription>
                        Review AI-routed patient symptom profiles and confirm their appointments.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="text-center p-12 bg-muted/20 border border-dashed rounded-lg">
                            <Check className="h-10 w-10 text-green-500 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium">All caught up!</h3>
                            <p className="text-muted-foreground">You have no pending appointment requests.</p>
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Patient Email</TableHead>
                                        <TableHead className="w-1/3">Symptoms</TableHead>
                                        <TableHead>AI Match</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {appointments.map((appt) => (
                                        <TableRow key={appt.id}>
                                            <TableCell className="font-medium">
                                                {new Date(appt.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{appt.patientEmail}</TableCell>
                                            <TableCell>
                                                <p className="text-sm line-clamp-2 text-muted-foreground" title={appt.symptoms}>
                                                    {appt.symptoms}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                                                    {appt.predictedSpecialty}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                                                    disabled={actionLoading === appt.id}
                                                    onClick={() => handleAction(appt.id, "CONFIRMED")}
                                                >
                                                    {actionLoading === appt.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                                                    Accept
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-destructive text-destructive hover:bg-destructive/10"
                                                    disabled={actionLoading === appt.id}
                                                    onClick={() => handleAction(appt.id, "REJECTED")}
                                                >
                                                    {actionLoading === appt.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                                                    Reject
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
