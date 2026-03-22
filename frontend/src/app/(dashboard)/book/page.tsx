"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AppointmentResponseDTO } from "@/types/types";
import { CheckCircle2, Loader2, Hospital } from "lucide-react";

export default function BookAppointmentPage() {
    const { user } = useAuth();
    const [symptoms, setSymptoms] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AppointmentResponseDTO | null>(null);

    // Provide a neat full-screen or large card layout
    if (user && user.role !== "PATIENT") {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-destructive">Access Denied</CardTitle>
                        <CardDescription>Only patients can book appointments here.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!symptoms || symptoms.trim().length < 5) {
            setError("Please provide a bit more detail about your symptoms.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await apiClient.bookAppointment({ symptoms });
            setResult(response);
        } catch (err: any) {
            setError(err.message || "Something went wrong booking the appointment.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookAnother = () => {
        setSymptoms("");
        setResult(null);
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            {!result ? (
                <Card className="shadow-lg border-primary/10">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <Hospital className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">Book an Appointment</CardTitle>
                        </div>
                        <CardDescription className="text-base">
                            Describe what you're feeling, and our smart system will match you with the right specialist automatically.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="symptoms" className="text-base font-semibold">
                                    What are your symptoms?
                                </Label>
                                <textarea
                                    id="symptoms"
                                    placeholder="E.g., I have been experiencing severe chest pain and shortness of breath for the last two days..."
                                    className="w-full min-h-[150px] p-4 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-muted-foreground">
                                    The more detail you provide, the better our AI can match you.
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 rounded bg-destructive/10 text-destructive text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Analyzing Symptoms...
                                    </>
                                ) : (
                                    "Find My Doctor"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <Card className="shadow-lg border-green-500/20 bg-green-50/50 dark:bg-green-950/10 transition-all animate-in fade-in zoom-in duration-500">
                    <CardHeader className="text-center space-y-4 pb-2">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 border-4 border-white dark:border-background shadow-sm">
                            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-green-700 dark:text-green-400">
                            Request Sent!
                        </CardTitle>
                        <CardDescription className="text-lg">
                            We've processed your symptoms and found the right match.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="rounded-xl bg-white dark:bg-background p-6 shadow-sm border space-y-4">
                            <div className="grid grid-cols-2 gap-y-4 text-sm">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground font-medium">Predicted Specialty</p>
                                    <p className="font-semibold text-lg">{result.predictedSpecialty}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground font-medium">Assigned Doctor</p>
                                    <p className="font-semibold text-lg">Dr. {result.assignedDoctorName}</p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <p className="text-muted-foreground font-medium">Status</p>
                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                                        {result.status} (Waiting for Doctor Confirmation)
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                            <p className="text-sm font-medium text-primary">
                                {result.message}
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center pt-2 pb-6">
                        <Button variant="outline" onClick={handleBookAnother}>
                            Book Another Appointment
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
