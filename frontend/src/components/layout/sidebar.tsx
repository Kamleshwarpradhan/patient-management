"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    CalendarDays,
    MessageSquare,
    FileText,
    Settings,
    LogOut,
    HeartPulse,
    UserCircle,
    PlusCircle,
    Inbox,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/auth-context";

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    // Dynamically build nav items based on role
    const getNavItems = () => {
        const role = user?.role;

        const items = [
            { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        ];

        if (role === "PATIENT") {
            items.push({ icon: PlusCircle, label: "Book Appointment", href: "/book" });
        } else if (role === "USER" || role === "DOCTOR") { // DOCTOR
            items.push({ icon: Inbox, label: "Requests", href: "/requests" });
            items.push({ icon: Users, label: "Patients", href: "/patients" });
        } else if (role === "ADMIN") {
            items.push({ icon: Users, label: "Admin", href: "/admin" });
            items.push({ icon: Inbox, label: "Requests", href: "/requests" });
        }

        return items;
    };

    const currentNavItems = getNavItems();

    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-[72px] flex-col items-center bg-sidebar py-6">
            {/* Logo */}
            <Link href="/dashboard" className="mb-8 flex items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/25">
                    <HeartPulse className="h-5 w-5 text-white" />
                </div>
            </Link>

            {/* Main Nav */}
            <nav className="flex flex-1 flex-col items-center gap-2">
                {currentNavItems.map((item) => {
                    const isActive =
                        item.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(item.href) && item.href !== "#";
                    return (
                        <Tooltip key={item.label} delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200",
                                        isActive
                                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                                            : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {isActive && (
                                        <div className="absolute -left-[24px] h-6 w-1 rounded-r-full bg-blue-400" />
                                    )}
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="font-medium">
                                {item.label}
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </nav>

            {/* Bottom Nav */}
            <div className="flex flex-col items-center gap-2">
                <Tooltip key="Profile" delayDuration={0}>
                    <TooltipTrigger asChild>
                        <Link
                            href="/profile"
                            className={cn(
                                "flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200",
                                pathname === "/profile"
                                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            )}
                        >
                            <UserCircle className="h-5 w-5" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                        Profile
                    </TooltipContent>
                </Tooltip>
                
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <button
                            onClick={logout}
                            className="flex h-11 w-11 items-center justify-center rounded-xl text-sidebar-foreground/60 transition-all duration-200 hover:bg-red-500/20 hover:text-red-400"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                        Logout
                    </TooltipContent>
                </Tooltip>
            </div>
        </aside>
    );
}
