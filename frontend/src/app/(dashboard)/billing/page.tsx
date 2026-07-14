"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CreditCard,
    Receipt,
    Clock,
    CheckCircle2,
    Loader2,
    AlertCircle,
    IndianRupee,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api";
import { BillingAccount, Invoice } from "@/types/types";

export default function BillingPage() {
    const { user } = useAuth();
    const [billingAccount, setBillingAccount] = useState<BillingAccount | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);

    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                setLoading(true);
                const [account, invoiceList] = await Promise.all([
                    apiClient.getBillingAccount(),
                    apiClient.getInvoices(),
                ]);
                setBillingAccount(account);
                setInvoices(invoiceList);
            } catch (err) {
                console.error("Failed to fetch billing data", err);
                setError("Failed to load billing information.");
            } finally {
                setLoading(false);
            }
        };

        fetchBillingData();
    }, []);

    const handlePayInvoice = async (invoiceId: string) => {
        setPayingInvoiceId(invoiceId);
        try {
            const result = await apiClient.payInvoice(invoiceId, "SIMULATED");
            if (result.success) {
                // Refresh billing data after successful payment
                const [account, invoiceList] = await Promise.all([
                    apiClient.getBillingAccount(),
                    apiClient.getInvoices(),
                ]);
                setBillingAccount(account);
                setInvoices(invoiceList);
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error("Payment failed", err);
            alert("Payment failed. Please try again.");
        } finally {
            setPayingInvoiceId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
                <AlertCircle className="h-10 w-10 text-red-400" />
                <p className="text-muted-foreground">{error}</p>
            </div>
        );
    }

    const pendingCount = invoices.filter((i) => i.status === "PENDING").length;
    const paidCount = invoices.filter((i) => i.status === "PAID").length;
    const totalOwed = invoices
        .filter((i) => i.status === "PENDING")
        .reduce((sum, i) => sum + i.amount, 0);

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Billing & Invoices</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    View your billing account and invoice history
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Account Balance */}
                <Card className="border-border/40 shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                                <IndianRupee className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                    Account Balance
                                </p>
                                <p className="text-2xl font-bold">
                                    ₹{billingAccount?.balance?.toFixed(2) ?? "0.00"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Invoices */}
                <Card className="border-border/40 shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                                <Clock className="h-5 w-5 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                    Pending
                                </p>
                                <p className="text-2xl font-bold">
                                    {pendingCount}
                                    <span className="text-sm font-normal text-muted-foreground ml-2">
                                        (₹{totalOwed.toFixed(2)})
                                    </span>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Paid Invoices */}
                <Card className="border-border/40 shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                    Paid
                                </p>
                                <p className="text-2xl font-bold">{paidCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Account Info Card */}
            {billingAccount && (
                <Card className="border-border/40 shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Billing Account
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Account ID</p>
                                <p className="font-mono text-xs mt-1">
                                    {billingAccount.accountId.slice(0, 8)}...
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Name</p>
                                <p className="font-medium mt-1">{billingAccount.name}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Email</p>
                                <p className="font-medium mt-1">{billingAccount.email}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Created</p>
                                <p className="font-medium mt-1">{billingAccount.createdAt}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Invoice List */}
            <Card className="border-border/40 shadow-sm">
                <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Invoice History
                        </h3>
                    </div>

                    {invoices.length === 0 ? (
                        <div className="text-center py-10">
                            <Receipt className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground">No invoices yet</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                                Invoices will appear here once a doctor confirms your appointment.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/40">
                                        <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">
                                            #
                                        </th>
                                        <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">
                                            Doctor
                                        </th>
                                        <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((invoice, idx) => (
                                        <tr
                                            key={invoice.invoiceId}
                                            className="border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="py-3.5 px-3 text-muted-foreground">
                                                {idx + 1}
                                            </td>
                                            <td className="py-3.5 px-3 font-medium">
                                                {invoice.doctorName}
                                            </td>
                                            <td className="py-3.5 px-3 font-semibold">
                                                ₹{invoice.amount.toFixed(2)}
                                            </td>
                                            <td className="py-3.5 px-3 text-muted-foreground">
                                                {new Date(invoice.createdAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="py-3.5 px-3">
                                                <Badge
                                                    variant="outline"
                                                    className={`rounded-lg text-xs ${
                                                        invoice.status === "PAID"
                                                            ? "border-green-200 bg-green-50 text-green-700"
                                                            : invoice.status === "PENDING"
                                                            ? "border-amber-200 bg-amber-50 text-amber-700"
                                                            : "border-red-200 bg-red-50 text-red-700"
                                                    }`}
                                                >
                                                    {invoice.status === "PAID" && (
                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    )}
                                                    {invoice.status === "PENDING" && (
                                                        <Clock className="h-3 w-3 mr-1" />
                                                    )}
                                                    {invoice.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3.5 px-3">
                                                {invoice.status === "PENDING" && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-1.5 rounded-lg text-xs border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                        onClick={() => handlePayInvoice(invoice.invoiceId)}
                                                        disabled={payingInvoiceId === invoice.invoiceId}
                                                    >
                                                        {payingInvoiceId === invoice.invoiceId ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <IndianRupee className="h-3 w-3" />
                                                        )}
                                                        Pay Now
                                                    </Button>
                                                )}
                                                {invoice.status === "PAID" && (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
