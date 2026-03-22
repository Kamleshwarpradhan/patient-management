"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { patientsToday } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const avatarColors = [
    "bg-blue-500",
    "bg-amber-500",
    "bg-purple-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-orange-500",
];

export function PatientsTodayList() {
    return (
        <Card className="border-0 bg-sidebar text-sidebar-foreground shadow-xl">
            <CardContent className="p-5">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-blue-400">19</span>
                        <span className="text-sm font-medium text-sidebar-foreground/70">
                            Patients today
                        </span>
                    </div>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent/50 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-white">
                        <ArrowUpRight className="h-4 w-4" />
                    </button>
                </div>

                {/* Patient List */}
                <div className="space-y-1">
                    {patientsToday.map((patient, index) => (
                        <div
                            key={patient.id}
                            className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-sidebar-accent/40"
                        >
                            <Avatar className="h-9 w-9 shrink-0">
                                <AvatarFallback
                                    className={cn(
                                        "text-xs font-semibold text-white",
                                        patient.avatarColor || avatarColors[index % avatarColors.length]
                                    )}
                                >
                                    {patient.initials}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-white truncate">
                                        {patient.name}
                                    </p>
                                    {patient.hasCheckmark && (
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                                    )}
                                </div>
                                <p className="text-xs text-sidebar-foreground/50">
                                    {patient.condition}
                                </p>
                            </div>

                            {patient.time && (
                                <span className="text-xs font-medium text-sidebar-foreground/40">
                                    {patient.time}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
