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
    Phone,
    MapPin,
    Loader2,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api";

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
    const [profileData, setProfileData] = useState({
        specialization: "General Medicine",
        phone: "+91 98765 43210", // Phone and clinic are placeholders as the backend only supports specialty for now
        clinicAddress: "123 Medical Street, City",
    });
    const [editData, setEditData] = useState(profileData);

    useEffect(() => {
        // Fetch real specialization from backend
        // This is necessary because JWT token context does not contain the 'specialty' field
        apiClient.getCurrentUser().then((detailedUser) => {
            const freshData = {
                specialization: detailedUser.specialty || "General Medicine",
                phone: "+91 98765 43210",
                clinicAddress: "123 Medical Street, City",
            };
            setProfileData(freshData);
            setEditData(freshData);
        }).catch((err) => {
            console.error("Failed to fetch fresh user data", err);
        });

        if (user?.role === "USER" || user?.role === "ADMIN") {
            apiClient.getDoctorStats()
                .then((data) => setPatientCount(data.totalPatients))
                .catch(() => { });
        }
    }, [user?.role]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Wait for DB save, if user is doctor saving specialty
            if (user?.role === "USER" || user?.role === "ADMIN") {
                 await apiClient.updateSpecialty(editData.specialization);
                 // Note: we can't update phone/address natively right now as backend only has specialty
            }
            setProfileData(editData);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save profile", error);
            alert("Failed to save profile data.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditData(profileData);
        setIsEditing(false);
    };

    const displayName = user ? getDisplayName(user.name, user.email) : "Doctor";
    const initials = user ? getInitials(user.name, user.email) : "DR";

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your account and clinic information
                </p>
            </div>

            {/* Profile Card */}
            <Card className="border-border/40 shadow-sm overflow-hidden">
                {/* Gradient Header */}
                <div className="h-32 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 relative">
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
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="pb-1">
                                <h3 className="text-xl font-bold">{displayName}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                        variant="outline"
                                        className="rounded-lg border-blue-200 bg-blue-50 text-blue-700 text-xs"
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
                    {user?.role !== "PATIENT" && (
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
                            Contact Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Email - read only */}
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

                            {/* Specialization (Doctors Only) */}
                            {user?.role !== "PATIENT" && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" />
                                        Specialization
                                    </Label>
                                    <Input
                                        value={isEditing ? editData.specialization : profileData.specialization}
                                        onChange={(e) =>
                                            setEditData({ ...editData, specialization: e.target.value })
                                        }
                                        readOnly={!isEditing}
                                        className={`rounded-xl ${!isEditing ? "bg-muted/50 cursor-not-allowed" : ""}`}
                                    />
                                </div>
                            )}

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                    Phone
                                </Label>
                                <Input
                                    value={isEditing ? editData.phone : profileData.phone}
                                    onChange={(e) =>
                                        setEditData({ ...editData, phone: e.target.value })
                                    }
                                    readOnly={!isEditing}
                                    className={`rounded-xl ${!isEditing ? "bg-muted/50 cursor-not-allowed" : ""}`}
                                />
                            </div>
                            
                            {/* Clinic Address (Doctors Only) */}
                            {user?.role !== "PATIENT" && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                        Clinic Address
                                    </Label>
                                    <Input
                                        value={isEditing ? editData.clinicAddress : profileData.clinicAddress}
                                        onChange={(e) =>
                                            setEditData({ ...editData, clinicAddress: e.target.value })
                                        }
                                        readOnly={!isEditing}
                                        className={`rounded-xl ${!isEditing ? "bg-muted/50 cursor-not-allowed" : ""}`}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
