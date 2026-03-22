"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, Clock } from "lucide-react";
import { appointments } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
    "First visit": "bg-blue-100 text-blue-700 border-blue-200",
    "Follow-up": "bg-amber-100 text-amber-700 border-amber-200",
    "Discharge summary": "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const avatarColors = [
    "bg-slate-400",
    "bg-blue-500",
    "bg-amber-500",
    "bg-slate-500",
    "bg-slate-400",
];

export function AppointmentsTable() {
    return (
        <Card className="border-border/40 shadow-sm">
            <CardContent className="p-5">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-base font-semibold">Appointment</h3>
                    <div className="flex gap-2">
                        <button className="rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors">
                            Status ▾
                        </button>
                        <button className="rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors">
                            Payment ▾
                        </button>
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr] items-center gap-4 border-b border-border/40 pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <span>Name</span>
                    <span>Status</span>
                    <span>Date</span>
                    <span>Time</span>
                    <span>Payment</span>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-border/30">
                    {appointments.map((apt, index) => (
                        <div
                            key={apt.id}
                            className="group grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr] items-center gap-4 py-3.5 transition-colors hover:bg-accent/30 rounded-lg px-1 -mx-1"
                        >
                            {/* Name */}
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback
                                        className={cn(
                                            "text-[10px] font-semibold text-white",
                                            avatarColors[index % avatarColors.length]
                                        )}
                                    >
                                        {apt.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{apt.patientName}</span>
                            </div>

                            {/* Status */}
                            <div>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "rounded-full px-2.5 py-0.5 text-[11px] font-medium border",
                                        statusColors[apt.status]
                                    )}
                                >
                                    {apt.status}
                                </Badge>
                            </div>

                            {/* Date */}
                            <span className="text-sm text-muted-foreground">{apt.date}</span>

                            {/* Time */}
                            <span className="text-sm text-muted-foreground">{apt.time}</span>

                            {/* Payment */}
                            <div className="flex items-center gap-1.5">
                                {apt.payment === "Paid" ? (
                                    <>
                                        <Check className="h-4 w-4 text-emerald-500" />
                                        <span className="text-sm font-medium text-emerald-600">
                                            Paid
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Clock className="h-4 w-4 text-amber-500" />
                                        <span className="text-sm font-medium text-amber-600">
                                            Pending
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
