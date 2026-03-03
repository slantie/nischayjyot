'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, BarChart3, HelpCircle, MessageCircle } from "lucide-react"
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
                                                    <Badge className="h-5 min-w-5 justify-center px-1 text-[10px] bg-primary text-primary-foreground">
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
            </aside>
        </TooltipProvider>
    )
}
