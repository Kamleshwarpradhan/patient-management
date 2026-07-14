"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Mail,
    Shield,
    Users,
    Calendar,
    Clock,
    Pencil,
    Save,
    X,
    Stethoscope,
    MapPin,
    Loader2,
    CalendarDays,
    CreditCard,
    IndianRupee,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api";
import { BillingAccount } from "@/types/types";

function getInitials(name: string, email: string): string {
    if (name) {
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }
    const emailName = email.split("@")[0];
    return emailName.slice(0, 2).toUpperCase();
}

function getDisplayName(name: string, email: string): string {
    if (name) return name;
    const emailName = email.split("@")[0];
    return emailName
        .split(/[._-]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export default function ProfilePage() {
    const { user } = useAuth();
    const [patientCount, setPatientCount] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Doctor profile state
    const [doctorData, setDoctorData] = useState({
        specialization: "General Medicine",
        clinicAddress: "123 Medical Street, City",
        consultationFee: 500,
    });
    const [editDoctorData, setEditDoctorData] = useState(doctorData);

    // Patient profile state
    const [patientData, setPatientData] = useState({
        address: "",
        dateOfBirth: "",
        registeredDate: "",
    });
    const [editPatientData, setEditPatientData] = useState(patientData);

    // Billing account state
    const [billingAccount, setBillingAccount] = useState<BillingAccount | null>(null);

    const isDoctor = user?.role === "DOCTOR" || user?.role === "ADMIN" || user?.role === "USER";
    const isPatient = user?.role === "PATIENT";

    useEffect(() => {
        if (isDoctor) {
            // Fetch doctor profile
            apiClient.getCurrentUser().then((detailedUser) => {
                const freshData = {
                    specialization: detailedUser.specialty || "General Medicine",
                    clinicAddress: detailedUser.clinicAddress || "123 Medical Street, City",
                    consultationFee: detailedUser.consultationFee || 500,
                };
                setDoctorData(freshData);
                setEditDoctorData(freshData);
            }).catch((err) => {
                console.error("Failed to fetch doctor data", err);
            });

            apiClient.getDoctorStats()
                .then((data) => setPatientCount(data.totalPatients))
                .catch(() => { });
        }

        if (isPatient) {
            // Fetch patient profile
            apiClient.getPatientProfile().then((patient) => {
                const freshData = {
                    address: patient.address || "Not provided",
                    dateOfBirth: patient.dateOfBirth || "",
                    registeredDate: patient.registeredDate || "",
                };
                setPatientData(freshData);
                setEditPatientData(freshData);
            }).catch((err) => {
                console.error("Failed to fetch patient data", err);
            });

            // Fetch billing account
            apiClient.getBillingAccount().then((account) => {
                setBillingAccount(account);
            }).catch((err) => {
                console.error("Failed to fetch billing data", err);
            });
        }
    }, [isDoctor, isPatient]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (isDoctor) {
                await apiClient.updateDoctorProfile({
                    specialty: editDoctorData.specialization,
                    clinicAddress: editDoctorData.clinicAddress,
                    consultationFee: Number(editDoctorData.consultationFee),
                });
                setDoctorData(editDoctorData);
            }
            if (isPatient) {
                await apiClient.updatePatientAddress(editPatientData.address);
                setPatientData({ ...patientData, address: editPatientData.address });
            }
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save profile", error);
            alert("Failed to save profile data.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditDoctorData(doctorData);
        setEditPatientData(patientData);
        setIsEditing(false);
    };

    const displayName = user ? getDisplayName(user.name, user.email) : "User";
    const initials = user ? getInitials(user.name, user.email) : "U";

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    {isDoctor ? "Manage your account and clinic information" : "Manage your personal information"}
                </p>
            </div>

            {/* Profile Card */}
            <Card className="border-border/40 shadow-sm overflow-hidden">
                {/* Gradient Header */}
                <div className={`h-32 relative ${isPatient
                    ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600"
                    : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"
                }`}>
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-1/4 h-32 w-32 rounded-full bg-white blur-2xl" />
                        <div className="absolute bottom-0 left-1/4 h-24 w-24 rounded-full bg-white blur-2xl" />
                    </div>
                </div>

                <CardContent className="relative px-6 pb-6">
                    {/* Avatar */}
                    <div className="flex items-end justify-between -mt-12 mb-6">
                        <div className="flex items-end gap-4">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                                <AvatarFallback className={`text-2xl font-bold text-white ${isPatient
                                    ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                                    : "bg-gradient-to-br from-blue-500 to-indigo-600"
                                }`}>
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="pb-1">
                                <h3 className="text-xl font-bold">{displayName}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                        variant="outline"
                                        className={`rounded-lg text-xs ${isPatient
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                            : "border-blue-200 bg-blue-50 text-blue-700"
                                        }`}
                                    >
                                        <Shield className="h-3 w-3 mr-1" />
                                        {user?.role || "DOCTOR"}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="rounded-lg border-green-200 bg-green-50 text-green-700 text-xs"
                                    >
                                        Active
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        {!isEditing ? (
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 rounded-xl"
                                onClick={() => setIsEditing(true)}
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit Profile
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 rounded-xl"
                                    onClick={handleCancel}
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    className="gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                                    Save
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Stats (Doctors Only) */}
                    {isDoctor && (
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {[
                                {
                                    icon: Users,
                                    label: "Total Patients",
                                    value: patientCount.toString(),
                                    color: "text-blue-500",
                                    bg: "bg-blue-50",
                                },
                                {
                                    icon: Calendar,
                                    label: "Member Since",
                                    value: "Feb 2026",
                                    color: "text-purple-500",
                                    bg: "bg-purple-50",
                                },
                                {
                                    icon: Clock,
                                    label: "Avg. Response",
                                    value: "< 2 hrs",
                                    color: "text-emerald-500",
                                    bg: "bg-emerald-50",
                                },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-xl border border-border/40 p-4 text-center"
                                >
                                    <div
                                        className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}
                                    >
                                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                    <div className="text-xl font-bold">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Info Fields */}
                    <div className="space-y-5">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            {isPatient ? "Personal Information" : "Contact Information"}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Email - always read only */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                    Email
                                </Label>
                                <Input
                                    value={user?.email || ""}
                                    readOnly
                                    className="rounded-xl bg-muted/50 cursor-not-allowed"
                                />
                            </div>

                            {/* === DOCTOR-SPECIFIC FIELDS === */}
                            {isDoctor && (
                                <>
                                    {/* Specialization */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium flex items-center gap-2">
                                            <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" />
                                            Specialization
                                        </Label>
                                        <Input
                                            value={isEditing ? editDoctorData.specialization : doctorData.specialization}
                                            onChange={(e) =>
                                                setEditDoctorData({ ...editDoctorData, specialization: e.target.value })
                                            }
                                            readOnly={!isEditing}
                                            className={`rounded-xl ${!isEditing ? "bg-muted/50 cursor-not-allowed" : ""}`}
                                        />
                                    </div>

                                    {/* Clinic Address */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium flex items-center gap-2">
                                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                            Clinic Address
                                        </Label>
                                        <Input
                                            value={isEditing ? editDoctorData.clinicAddress : doctorData.clinicAddress}
                                            onChange={(e) =>
                                                setEditDoctorData({ ...editDoctorData, clinicAddress: e.target.value })
                                            }
                                            readOnly={!isEditing}
                                            className={`rounded-xl ${!isEditing ? "bg-muted/50 cursor-not-allowed" : ""}`}
                                        />
                                    </div>

                                    {/* Consultation Fee */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium flex items-center gap-2">
                                            <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                                            Consultation Fee (₹)
                                        </Label>
                                        <Input
                                            type="number"
                                            value={isEditing ? editDoctorData.consultationFee : doctorData.consultationFee}
                                            onChange={(e) =>
                                                setEditDoctorData({ ...editDoctorData, consultationFee: Number(e.target.value) })
                                            }
                                            readOnly={!isEditing}
                                            className={`rounded-xl ${!isEditing ? "bg-muted/50 cursor-not-allowed" : ""}`}
                                        />
                                    </div>
                                </>
                            )}

                            {/* === PATIENT-SPECIFIC FIELDS === */}
                            {isPatient && (
                                <>
                                    {/* Date of Birth - read only */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium flex items-center gap-2">
                                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                                            Date of Birth
                                        </Label>
                                        <Input
                                            value={patientData.dateOfBirth || "Not provided"}
                                            readOnly
                                            className="rounded-xl bg-muted/50 cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Address - editable */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium flex items-center gap-2">
                                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                            Address
                                        </Label>
                                        <Input
                                            value={isEditing ? editPatientData.address : patientData.address}
                                            onChange={(e) =>
                                                setEditPatientData({ ...editPatientData, address: e.target.value })
                                            }
                                            readOnly={!isEditing}
                                            className={`rounded-xl ${!isEditing ? "bg-muted/50 cursor-not-allowed" : ""}`}
                                        />
                                    </div>

                                    {/* Registered Date - read only */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            Registered Date
                                        </Label>
                                        <Input
                                            value={patientData.registeredDate || "Not available"}
                                            readOnly
                                            className="rounded-xl bg-muted/50 cursor-not-allowed"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Billing Account Card (Patients Only) */}
            {isPatient && billingAccount && (
                <Card className="border-border/40 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Billing Account
                            </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="rounded-xl border border-border/40 p-4 text-center">
                                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                                    <IndianRupee className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div className="text-xl font-bold">
                                    ₹{billingAccount.balance?.toFixed(2) ?? "0.00"}
                                </div>
                                <div className="text-xs text-muted-foreground">Balance</div>
                            </div>
                            <div className="rounded-xl border border-border/40 p-4 text-center">
                                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                                    <CreditCard className="h-5 w-5 text-blue-500" />
                                </div>
                                <div className="text-sm font-mono font-bold">
                                    {billingAccount.accountId?.slice(0, 8)}...
                                </div>
                                <div className="text-xs text-muted-foreground">Account ID</div>
                            </div>
                            <div className="rounded-xl border border-border/40 p-4 text-center">
                                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                                    <Calendar className="h-5 w-5 text-purple-500" />
                                </div>
                                <div className="text-sm font-bold">{billingAccount.createdAt}</div>
                                <div className="text-xs text-muted-foreground">Created</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
