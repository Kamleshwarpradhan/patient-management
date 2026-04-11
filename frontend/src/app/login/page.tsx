"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeartPulse, Loader2, Mail, Lock, ArrowRight, CheckCircle2, UserRound, Stethoscope } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { AuthProvider } from "@/context/auth-context";
import { Suspense } from "react";

function LoginForm() {
    const [role, setRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const searchParams = useSearchParams();
    const justRegistered = searchParams.get("registered") === "true";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login(email, password, role);
        } catch {
            setError("Invalid email or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-purple-100/10 blur-3xl" />
            </div>

            <Card className="relative w-full max-w-[420px] border-border/30 shadow-2xl shadow-blue-500/5 backdrop-blur-sm">
                <CardContent className="p-8">
                    {/* Logo */}
                    <div className="mb-6 flex flex-col items-center">
                        <Link href="/" className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                            <HeartPulse className="h-7 w-7 text-white" />
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                        <p className="mt-1 text-sm text-center text-muted-foreground">
                            Sign in to PatientHub as a {role === "PATIENT" ? "Patient" : "Doctor"}
                        </p>
                    </div>

                    {/* Role Toggle */}
                    <div className="flex p-1 mb-6 bg-muted/50 rounded-xl border border-border/50">
                        <button
                            type="button"
                            onClick={() => setRole("PATIENT")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                                role === "PATIENT" 
                                    ? "bg-white text-blue-600 shadow-sm dark:bg-background dark:text-blue-400" 
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <UserRound className="h-4 w-4" />
                            Patient
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("DOCTOR")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                                role === "DOCTOR" 
                                    ? "bg-white text-blue-600 shadow-sm dark:bg-background dark:text-blue-400" 
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <Stethoscope className="h-4 w-4" />
                            Doctor
                        </button>
                    </div>

                    {/* Registration success */}
                    {justRegistered && (
                        <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            Account created successfully! Please sign in.
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={role === "PATIENT" ? "patient@example.com" : "doctor@clinic.com"}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="rounded-xl pl-9 h-11"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </Label>
                                <button
                                    type="button"
                                    className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="rounded-xl pl-9 h-11"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all font-medium"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <AuthProvider>
            <Suspense>
                <LoginForm />
            </Suspense>
        </AuthProvider>
    );
}
