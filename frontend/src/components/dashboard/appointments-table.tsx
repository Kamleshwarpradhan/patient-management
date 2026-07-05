"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, Clock, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api";
import { AppointmentModel } from "@/types/types";
import { useNotifications } from "@/hooks/use-notifications";

const statusConfig: Record<string, { label: string; class: string }> = {
    PENDING: {
        label: "Pending",
        class: "bg-amber-100 text-amber-700 border-amber-200",
    },
    CONFIRMED: {
        label: "Confirmed",
        class: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    REJECTED: {
        label: "Rejected",
        class: "bg-red-100 text-red-700 border-red-200",
    },
    CANCELED: {
        label: "Canceled",
        class: "bg-gray-100 text-gray-700 border-gray-200",
    },
};

const avatarColors = [
    "bg-blue-500",
    "bg-indigo-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-purple-500",
    "bg-rose-500",
];

function getInitials(email: string): string {
    const name = email.split("@")[0];
    const parts = name.split(/[._-]/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

export function AppointmentsTable() {
    const [appointments, setAppointments] = useState<AppointmentModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { latestToast } = useNotifications();

    useEffect(() => {
        apiClient
            .getDoctorAppointments()
            .then((data) => setAppointments(data))
            .catch((err) => console.error("Failed to load appointments", err))
            .finally(() => setIsLoading(false));
    }, [latestToast]);

    return (
        <Card className="border-border/40 shadow-sm">
            <CardContent className="p-5">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-base font-semibold">Appointments</h3>
                    <span className="text-xs text-muted-foreground">
                        {appointments.length} total
                    </span>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        No appointments yet
                    </div>
                ) : (
                    <>
                        {/* Table Header */}
                        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] items-center gap-4 border-b border-border/40 pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <span>Patient</span>
                            <span>Symptoms</span>
                            <span>Date</span>
                            <span>Status</span>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-border/30">
                            {appointments.map((apt, index) => {
                                const cfg = statusConfig[apt.status] || statusConfig.PENDING;
                                return (
                                    <div
                                        key={apt.id}
                                        className="group grid grid-cols-[2fr_1.5fr_1fr_1fr] items-center gap-4 py-3.5 transition-colors hover:bg-accent/30 rounded-lg px-1 -mx-1"
                                    >
                                        {/* Patient */}
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback
                                                    className={cn(
                                                        "text-[10px] font-semibold text-white",
                                                        avatarColors[index % avatarColors.length]
                                                    )}
                                                >
                                                    {getInitials(apt.patientEmail)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium truncate">
                                                {apt.patientEmail}
                                            </span>
                                        </div>

                                        {/* Symptoms */}
                                        <span
                                            className="text-sm text-muted-foreground truncate"
                                            title={apt.symptoms}
                                        >
                                            {apt.symptoms}
                                        </span>

                                        {/* Date */}
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(apt.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                            })}
                                        </span>

                                        {/* Status */}
                                        <div>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "rounded-full px-2.5 py-0.5 text-[11px] font-medium border",
                                                    cfg.class
                                                )}
                                            >
                                                {apt.status === "CONFIRMED" && (
                                                    <Check className="h-3 w-3 mr-1 inline" />
                                                )}
                                                {apt.status === "REJECTED" && (
                                                    <X className="h-3 w-3 mr-1 inline" />
                                                )}
                                                {apt.status === "PENDING" && (
                                                    <Clock className="h-3 w-3 mr-1 inline" />
                                                )}
                                                {cfg.label}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
