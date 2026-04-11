"use client";

import { Bell, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

function getInitials(name: string, email: string): string {
    if (name) {
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }
    // Fallback to email
    const emailName = email.split("@")[0];
    return emailName.slice(0, 2).toUpperCase();
}

function getDisplayName(name: string, email: string): string {
    if (name) return name;
    // Fallback to email-derived name
    const emailName = email.split("@")[0];
    return emailName
        .split(/[._-]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export function Header() {
    const { logout, user } = useAuth();
    const { notifications, latestToast, markAllAsRead, clearToast } = useNotifications();

    const displayName = user ? getDisplayName(user.name, user.email) : "Doctor";
    const initials = user ? getInitials(user.name, user.email) : "DR";
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="flex h-16 items-center justify-between px-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Hello, {displayName}!
            </h1>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        className="w-64 rounded-full border-border/50 bg-card pl-9 shadow-sm focus-visible:ring-primary/30"
                    />
                </div>

                {/* Notifications */}
                <DropdownMenu onOpenChange={(open) => {
                    if (open && unreadCount > 0) markAllAsRead();
                }}>
                    <DropdownMenuTrigger asChild>
                        <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-sm transition-colors hover:bg-accent outline-none">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            {unreadCount > 0 && (
                                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
                            <h3 className="font-semibold text-sm">Notifications</h3>
                            <span className="text-xs text-muted-foreground">{notifications.length} total</span>
                        </div>
                        <div className="max-h-[350px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground">
                                    <Bell className="h-8 w-8 mb-2 opacity-20" />
                                    No new notifications
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className={`p-4 border-b last:border-0 transition-colors ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-muted/50'}`}>
                                        <div className="flex justify-between items-start mb-1 gap-2">
                                            <span className="text-sm font-medium line-clamp-1">{notif.title}</span>
                                            <span className="text-[#888] text-[11px] whitespace-nowrap pt-0.5">
                                                {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{notif.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-sm ring-2 ring-primary/10 transition-all hover:ring-primary/30">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <div className="px-3 py-2">
                            <p className="text-sm font-medium">{displayName}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="text-red-600">
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Live Toast Overlay */}
            {latestToast && (
                <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-8 fade-in duration-300">
                    <div className="flex w-[340px] flex-col gap-1.5 rounded-xl border border-border/50 bg-card p-5 shadow-2xl ring-1 ring-black/5">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                                <span className="font-semibold text-sm">{latestToast.title}</span>
                            </div>
                            <button onClick={clearToast} className="text-muted-foreground hover:text-foreground transition-colors p-1 -mr-1 -mt-1 rounded-md hover:bg-muted">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-sm text-muted-foreground pl-4 leading-relaxed">{latestToast.message}</p>
                    </div>
                </div>
            )}
        </header>
    );
}
