'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, FileText, Bot, HelpCircle, Star, Bell } from "lucide-react"
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

export function CitizenSidebar({ unreadCount = 0 }: { unreadCount?: number }) {
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
                                                {!isCollapsed && label === "Notifications" && unreadCount > 0 && (
                                                    <Badge className="h-5 min-w-5 justify-center px-1 text-[10px] bg-primary text-primary-foreground">
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
            </aside>
        </TooltipProvider>
    )
}
