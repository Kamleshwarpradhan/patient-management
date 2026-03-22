"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { AppointmentModel } from "@/types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Hospital, CalendarClock, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PatientAppointmentsTable() {
    const [appointments, setAppointments] = useState<AppointmentModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        apiClient.getPatientAppointments()
            .then((data) => setAppointments(data))
            .catch((err) => console.error("Error fetching patient appointments:", err))
            .finally(() => setIsLoading(false));
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>;
            case "PENDING":
                return <Badge variant="outline" className="text-yellow-600 border-yellow-500">Pending</Badge>;
            case "REJECTED":
                return <Badge variant="destructive">Declined</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <Card className="col-span-1 border-primary/10 shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">My Appointments</CardTitle>
                        <CardDescription>Track your appointment requests and AI AI-predicted matches.</CardDescription>
                    </div>
                    <Link href="/book">
                        <Button size="sm">Book New</Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="text-center p-8 bg-muted/20 border-2 border-dashed rounded-lg">
                        <Hospital className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-3" />
                        <h4 className="font-semibold">No Appointments Yet</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            You haven't requested any appointments yet.
                        </p>
                        <Link href="/book">
                            <Button variant="outline">Book an Appointment</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Specialty</TableHead>
                                    <TableHead>Symptoms Summary</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {appointments.map((appt) => (
                                    <TableRow key={appt.id}>
                                        <TableCell className="font-medium whitespace-nowrap">
                                            {new Date(appt.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {appt.status === "CONFIRMED" ? (
                                                <span className="font-semibold text-primary">{appt.doctorEmail}</span>
                                            ) : (
                                                <span className="text-muted-foreground">{appt.doctorEmail}</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1">
                                                <Activity className="h-3 w-3 text-muted-foreground" />
                                                <span>{appt.predictedSpecialty}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate text-muted-foreground" title={appt.symptoms}>
                                            {appt.symptoms}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {getStatusBadge(appt.status)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
