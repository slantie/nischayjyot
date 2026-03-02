'use client'

import Link from "next/link"
import { Menu, Bell, Scale, LogOut, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/actions/auth"
import { useSidebar } from "@/components/layout/sidebar-context"

export function TopNavbar({
    userName,
    variant,
    notifCount = 0,
    pendingCount = 0,
}: {
    userName: string
    variant: "citizen" | "admin"
    notifCount?: number
    pendingCount?: number
}) {
    const { toggle } = useSidebar()

    return (
        <header className="fixed top-0 right-0 left-0 z-30 flex h-14 items-center gap-3 border-b bg-white px-4 shadow-sm">
            {/* Hamburger */}
            <Button
                variant="ghost"
                size="icon"
                onClick={toggle}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label="Toggle sidebar"
            >
                <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <Link href={variant === "citizen" ? "/home" : "/dashboard"} className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                    <Scale className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="hidden text-sm font-semibold text-foreground sm:inline">NishchayJyot</span>
            </Link>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Notification bell — citizen only */}
            {variant === "citizen" && (
                <Link href="/notifications">
                    <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Bell className="h-5 w-5" />
                        {notifCount > 0 && (
                            <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 justify-center px-1 text-[10px] bg-accent text-accent-foreground">
                                {notifCount > 9 ? "9+" : notifCount}
                            </Badge>
                        )}
                    </Button>
                </Link>
            )}

            {/* Admin pending badge */}
            {variant === "admin" && pendingCount > 0 && (
                <Badge variant="outline" className="hidden text-xs sm:flex border-accent text-accent">
                    {pendingCount} pending
                </Badge>
            )}

            {/* User dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-8 items-center gap-1.5 rounded-full px-2 text-sm font-medium hover:bg-muted">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-3.5 w-3.5" />
                        </div>
                        <span className="hidden max-w-[120px] truncate sm:inline">{userName}</span>
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                    {variant === "citizen" && (
                        <DropdownMenuItem asChild>
                            <Link href="/profile" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <form action={signOut}>
                        <DropdownMenuItem asChild>
                            <button type="submit" className="flex w-full items-center gap-2 text-destructive">
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
                        </DropdownMenuItem>
                    </form>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
