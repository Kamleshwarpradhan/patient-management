"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api";
import { Patient, PatientRequest } from "@/types/types";
import { Loader2 } from "lucide-react";

interface PatientDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    patient: Patient | null;
}

export function PatientDialog({
    open,
    onClose,
    onSuccess,
    patient,
}: PatientDialogProps) {
    const isEditing = !!patient;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        dateofBirth: "",
        registeredDate: new Date().toISOString().split("T")[0],
    });

    useEffect(() => {
        if (patient) {
            setFormData({
                name: patient.name,
                email: patient.email,
                address: patient.address,
                dateofBirth: patient.dateOfBirth,
                registeredDate: new Date().toISOString().split("T")[0],
            });
        } else {
            setFormData({
                name: "",
                email: "",
                address: "",
                dateofBirth: "",
                registeredDate: new Date().toISOString().split("T")[0],
            });
        }
        setError("");
    }, [patient, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const request: PatientRequest = {
                name: formData.name,
                email: formData.email,
                address: formData.address,
                dateofBirth: formData.dateofBirth,
                registeredDate: formData.registeredDate,
            };

            if (isEditing && patient) {
                await apiClient.updatePatient(patient.id, request);
            } else {
                await apiClient.createPatient(request);
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An error occurred"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[480px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {isEditing ? "Edit Patient" : "Add New Patient"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the patient's information below."
                            : "Fill in the details to register a new patient."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    {error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            required
                            className="rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            required
                            className="rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium">
                            Address
                        </Label>
                        <Input
                            id="address"
                            placeholder="123 Main St, City"
                            value={formData.address}
                            onChange={(e) => updateField("address", e.target.value)}
                            required
                            className="rounded-xl"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dob" className="text-sm font-medium">
                                Date of Birth
                            </Label>
                            <Input
                                id="dob"
                                type="date"
                                value={formData.dateofBirth}
                                onChange={(e) => updateField("dateofBirth", e.target.value)}
                                required
                                className="rounded-xl"
                            />
                        </div>
                        {!isEditing && (
                            <div className="space-y-2">
                                <Label htmlFor="regDate" className="text-sm font-medium">
                                    Registered Date
                                </Label>
                                <Input
                                    id="regDate"
                                    type="date"
                                    value={formData.registeredDate}
                                    onChange={(e) =>
                                        updateField("registeredDate", e.target.value)
                                    }
                                    required
                                    className="rounded-xl"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="rounded-xl px-5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 shadow-lg shadow-blue-500/25"
                        >
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isEditing ? "Update Patient" : "Add Patient"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
