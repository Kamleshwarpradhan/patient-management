"use client";

import { Card, CardContent } from "@/components/ui/card";
import { workingHoursData } from "@/lib/mock-data";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function WorkingHoursChart() {
    const totalHours = workingHoursData.reduce((sum, d) => sum + d.value, 0);

    return (
        <Card className="border-border/40 shadow-sm">
            <CardContent className="p-5">
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-base font-semibold">Working hours</h3>
                    <button className="rounded-lg border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors">
                        Week ▾
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    {/* Donut Chart */}
                    <div className="relative h-[140px] w-[140px] shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={workingHoursData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={42}
                                    outerRadius={62}
                                    paddingAngle={4}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {workingHoursData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold">{totalHours}</span>
                            <span className="text-[10px] text-muted-foreground">
                                Total hours
                            </span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="space-y-3">
                        {workingHoursData.map((item) => (
                            <div key={item.name} className="flex items-center gap-2.5">
                                <span
                                    className="h-2.5 w-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: item.color }}
                                />
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-sm font-semibold">{item.value}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {item.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
