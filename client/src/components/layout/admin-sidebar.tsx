'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    FileText,
    BarChart3,
    HelpCircle,
    Scale,
    LogOut,
    ShieldCheck,
    MessageCircle,
} from "lucide-react"
import { signOut } from "@/actions/auth"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebar } from "@/components/layout/sidebar-context"

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/manage-grievances", label: "Grievances", icon: FileText },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/admin-feedback", label: "Feedback", icon: MessageCircle },
    { href: "/manage-faqs", label: "Manage FAQs", icon: HelpCircle },
]

export function AdminSidebar({
    pendingCount = 0,
    adminName = "Admin",
    role = "admin",
}: {
    pendingCount?: number
    adminName?: string
    role?: string
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
                            <p className="text-[10px] text-sidebar-foreground/60">Admin Panel</p>
                        </div>
                    </div>
                )}

                {/* Admin Identity */}
                {!isCollapsed && (
                    <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                            <ShieldCheck className="h-4 w-4 text-sidebar-primary" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-sidebar-foreground">{adminName}</p>
                            <Badge variant="outline" className="mt-0.5 h-4 px-1 text-[9px] font-normal capitalize border-sidebar-border text-sidebar-foreground/70">
                                {role.replace("_", " ")}
                            </Badge>
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
                                                {!isCollapsed && label === "Grievances" && pendingCount > 0 && (
                                                    <Badge className="h-5 min-w-5 justify-center px-1 text-[10px] bg-accent text-accent-foreground">
                                                        {pendingCount > 99 ? "99+" : pendingCount}
                                                    </Badge>
                                                )}
                                            </Link>
                                        </TooltipTrigger>
                                        {isCollapsed && (
                                            <TooltipContent side="right" className="font-medium">
                                                {label}
                                                {label === "Grievances" && pendingCount > 0 && ` (${pendingCount})`}
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="border-t border-sidebar-border p-2">
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
