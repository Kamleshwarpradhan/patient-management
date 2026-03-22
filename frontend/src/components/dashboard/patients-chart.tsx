"use client";

import { Card, CardContent } from "@/components/ui/card";
import { monthlyData } from "@/lib/mock-data";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

export function PatientsChart() {
    return (
        <Card className="border-border/40 shadow-sm">
            <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-semibold">Patients</h3>
                    <div className="flex gap-2">
                        <button className="rounded-lg border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors">
                            Recovered ▾
                        </button>
                        <button className="rounded-lg border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors">
                            Month ▾
                        </button>
                    </div>
                </div>

                <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={monthlyData}
                            barCategoryGap="25%"
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="hsl(0 0% 90%)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }}
                                width={30}
                            />
                            <Tooltip
                                cursor={{ fill: "hsl(0 0% 96%)" }}
                                contentStyle={{
                                    borderRadius: "10px",
                                    border: "1px solid hsl(0 0% 90%)",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                    fontSize: "12px",
                                }}
                                labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                                formatter={(value: number | undefined) => [`${value ?? 0} recovered`, ""]}
                            />
                            <Bar dataKey="recovered" radius={[6, 6, 2, 2]}>
                                {monthlyData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            entry.month === "Jun"
                                                ? "url(#barGradientActive)"
                                                : "url(#barGradient)"
                                        }
                                    />
                                ))}
                            </Bar>
                            <defs>
                                <linearGradient
                                    id="barGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop offset="0%" stopColor="#93B5FF" />
                                    <stop offset="100%" stopColor="#B8D0FF" />
                                </linearGradient>
                                <linearGradient
                                    id="barGradientActive"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop offset="0%" stopColor="#4F7BFF" />
                                    <stop offset="100%" stopColor="#6C9BFF" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    recovered
                </div>
            </CardContent>
        </Card>
    );
}
