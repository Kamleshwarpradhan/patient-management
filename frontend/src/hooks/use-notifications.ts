"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

export interface DashboardNotification {
    id: string;
    type: "NEW_REQUEST" | "STATUS_UPDATE" | "SYSTEM";
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
}

export function useNotifications() {
    const { token, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
    const [latestToast, setLatestToast] = useState<DashboardNotification | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !token) return;

        // Native EventSource cannot send Authorization headers. 
        // We pass the JWT token securely via query string (validated by API Gateway).
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088";
        const eventSource = new EventSource(`${API_BASE_URL}/api/notifications/stream?token=${token}`);

        eventSource.addEventListener("notification", (event) => {
            try {
                const data = JSON.parse(event.data);
                
                const newNotification: DashboardNotification = {
                    id: Math.random().toString(36).substring(7),
                    type: data.type || "SYSTEM",
                    title: data.title || "Notification",
                    message: data.message || "You have a new alert.",
                    timestamp: new Date(),
                    read: false,
                };
                
                setNotifications((prev) => [newNotification, ...prev]);
                setLatestToast(newNotification);
                
                // Clear the toast automatically
                setTimeout(() => setLatestToast(null), 5000);
            } catch (err) {
                console.error("Failed to parse SSE message:", err, event.data);
            }
        });

        eventSource.onerror = (err) => {
            console.error("SSE connection error:", err);
            // Browser will auto-reconnect EventSource automatically
        };

        return () => {
            eventSource.close();
        };
    }, [isAuthenticated, token]);

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true }))
        );
    };

    const clearToast = () => setLatestToast(null);

    return { notifications, latestToast, markAllAsRead, clearToast };
}
