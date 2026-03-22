"use client";

import { Bell, Search } from "lucide-react";
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

    const displayName = user ? getDisplayName(user.name, user.email) : "Doctor";
    const initials = user ? getInitials(user.name, user.email) : "DR";

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
                <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-sm transition-colors hover:bg-accent">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
                </button>

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
        </header>
    );
}
