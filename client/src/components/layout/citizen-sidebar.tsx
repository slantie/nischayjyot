'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Home,
    FileText,
    Bot,
    HelpCircle,
    Star,
    Bell,
    Scale,
    LogOut,
    User,
} from "lucide-react"
import { signOut } from "@/actions/auth"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebar } from "@/components/layout/sidebar-context"

const navItems = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/track-grievance", label: "My Grievances", icon: FileText },
    { href: "/chatbot", label: "AI Chatbot", icon: Bot },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
    { href: "/feedback", label: "Feedback", icon: Star },
    { href: "/notifications", label: "Notifications", icon: Bell },
]

export function CitizenSidebar({
    unreadCount = 0,
}: {
    unreadCount?: number
}) {
    const pathname = usePathname()
    const { isCollapsed } = useSidebar()

    return (
        <TooltipProvider delayDuration={0}>
            <aside className="flex h-full flex-col bg-sidebar overflow-hidden">
                {/* Logo */}
                {!isCollapsed && (
                    <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                            <Scale className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold leading-none text-sidebar-foreground">NishchayJyot</p>
                            <p className="text-[10px] text-sidebar-foreground/60">Citizen Portal</p>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 overflow-auto py-3 px-2">
                    <ul className="space-y-0.5">
                        {navItems.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href || pathname.startsWith(href + "/")
                            return (
                                <li key={href}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href={href}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                                                    isCollapsed && "justify-center px-2",
                                                    isActive
                                                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                                )}
                                            >
                                                <Icon className="h-4 w-4 shrink-0" />
                                                {!isCollapsed && <span className="flex-1">{label}</span>}
                                                {!isCollapsed && label === "Notifications" && unreadCount > 0 && (
                                                    <Badge className="h-5 min-w-5 justify-center px-1 text-[10px] bg-accent text-accent-foreground">
                                                        {unreadCount > 99 ? "99+" : unreadCount}
                                                    </Badge>
                                                )}
                                            </Link>
                                        </TooltipTrigger>
                                        {isCollapsed && (
                                            <TooltipContent side="right" className="font-medium">
                                                {label}
                                                {label === "Notifications" && unreadCount > 0 && ` (${unreadCount})`}
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="border-t border-sidebar-border p-2 space-y-0.5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/profile"
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    isCollapsed && "justify-center px-2"
                                )}
                            >
                                <User className="h-4 w-4" />
                                {!isCollapsed && "Profile"}
                            </Link>
                        </TooltipTrigger>
                        {isCollapsed && <TooltipContent side="right">Profile</TooltipContent>}
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <form action={signOut}>
                                <button
                                    type="submit"
                                    className={cn(
                                        "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-destructive/20 hover:text-destructive",
                                        isCollapsed && "justify-center px-2"
                                    )}
                                >
                                    <LogOut className="h-4 w-4" />
                                    {!isCollapsed && "Sign out"}
                                </button>
                            </form>
                        </TooltipTrigger>
                        {isCollapsed && <TooltipContent side="right">Sign out</TooltipContent>}
                    </Tooltip>
                </div>
            </aside>
        </TooltipProvider>
    )
}
