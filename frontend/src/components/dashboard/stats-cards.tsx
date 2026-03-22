"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, MoreHorizontal, Star, UserRoundSearch } from "lucide-react";

export function StatsCards({ patientCount, doctorCount }: { patientCount: number, doctorCount?: number }) {
    return (
        <div className="grid grid-cols-3 gap-5">
            {/* Peak Activity Hours (Keep this for everyone for now) */}
            <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Peak activity hours
                        </h3>
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent transition-colors">
                            <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex items-end gap-3">
                        <div className="flex items-end gap-[3px] h-16">
                            {[40, 55, 70, 85, 65, 50, 75, 90, 60, 45, 80, 55].map(
                                (h, i) => (
                                    <div
                                        key={i}
                                        className="w-2 rounded-full bg-gradient-to-t from-blue-500/60 to-blue-400 transition-all hover:from-blue-500 hover:to-blue-300"
                                        style={{ height: `${h}%` }}
                                    />
                                )
                            )}
                        </div>
                    </div>
                    <div className="mt-3 flex gap-4 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            by appointment
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                            walk-in queue
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Total Patients */}
            <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Total patients
                        </h3>
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-bold tracking-tight">
                            {patientCount}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                            +13%
                        </span>
                        <span className="text-xs text-muted-foreground">
                            vs last month
                        </span>
                    </div>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-blue-400" />
                    </div>
                </CardContent>
            </Card>

            {/* Third Card: Total Doctors (for Admin) OR Avg Doctor Rating (for Doctors) */}
            {doctorCount !== undefined ? (
                // Total Doctors Card
                <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Total Doctors
                            </h3>
                            <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent transition-colors">
                                <UserRoundSearch className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-bold tracking-tight text-purple-600">
                                {doctorCount}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                                Active
                            </span>
                        </div>
                        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />
                        </div>
                    </CardContent>
                </Card>
            ) : (
                // Avg Doctor Rating Card
                <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Avg doctor rating
                            </h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold tracking-tight text-amber-500">
                                    4.9
                                </span>
                            </div>
                            <div className="text-right">
                                <div className="flex gap-0.5 mb-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star
                                            key={i}
                                            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-amber-500 font-medium">
                                    654{" "}
                                    <span className="text-muted-foreground font-normal">
                                        reviews
                                    </span>
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
