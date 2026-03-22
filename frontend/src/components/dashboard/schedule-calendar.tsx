"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday-based
}

export function ScheduleCalendar() {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    // Get previous month last days
    const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
    const prevDays = Array.from(
        { length: firstDay },
        (_, i) => prevMonthDays - firstDay + i + 1
    );

    // Current month days
    const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Next month days to fill the grid
    const totalCells = Math.ceil((prevDays.length + currentDays.length) / 7) * 7;
    const nextDays = Array.from(
        { length: totalCells - prevDays.length - currentDays.length },
        (_, i) => i + 1
    );

    const navigate = (direction: number) => {
        let newMonth = currentMonth + direction;
        let newYear = currentYear;
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const isToday = (day: number) =>
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

    return (
        <Card className="border-0 bg-sidebar text-sidebar-foreground shadow-xl">
            <CardContent className="p-5">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-white">My Schedule</h3>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-white"
                            onClick={() => navigate(-1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-white"
                            onClick={() => navigate(1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Day headers */}
                <div className="mb-2 grid grid-cols-7 gap-1">
                    {DAYS.map((day, index) => (
                        <div
                            key={day}
                            className={cn(
                                "text-center text-[10px] font-medium tracking-wider",
                                index >= 5
                                    ? "text-orange-400"
                                    : "text-sidebar-foreground/50"
                            )}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1">
                    {/* Previous month */}
                    {prevDays.map((day) => (
                        <div
                            key={`prev-${day}`}
                            className="flex h-8 items-center justify-center text-xs text-sidebar-foreground/25"
                        >
                            {day}
                        </div>
                    ))}
                    {/* Current month */}
                    {currentDays.map((day) => (
                        <div
                            key={`cur-${day}`}
                            className={cn(
                                "flex h-8 items-center justify-center rounded-lg text-xs font-medium transition-all",
                                isToday(day)
                                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 cursor-pointer"
                            )}
                        >
                            {day}
                        </div>
                    ))}
                    {/* Next month */}
                    {nextDays.map((day) => (
                        <div
                            key={`next-${day}`}
                            className="flex h-8 items-center justify-center text-xs text-sidebar-foreground/25"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Time slot */}
                <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">10:00-12:30</span>
                    <span className="text-sm font-medium text-sidebar-foreground/50">
                        PM
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
