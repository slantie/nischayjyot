'use client'

import { TopNavbar } from "@/components/layout/top-navbar"
import { SidebarProvider, useSidebar } from "@/components/layout/sidebar-context"

export function DashboardShell({
    children,
    sidebar,
    userName,
    variant,
    notifCount = 0,
    pendingCount = 0,
}: {
    children: React.ReactNode
    sidebar: React.ReactNode
    userName: string
    variant: "citizen" | "admin"
    notifCount?: number
    pendingCount?: number
}) {
    return (
        <SidebarProvider>
            <DashboardShellInner
                sidebar={sidebar}
                userName={userName}
                variant={variant}
                notifCount={notifCount}
                pendingCount={pendingCount}
            >
                {children}
            </DashboardShellInner>
        </SidebarProvider>
    )
}

function DashboardShellInner({
    children,
    sidebar,
    userName,
    variant,
    notifCount,
    pendingCount,
}: {
    children: React.ReactNode
    sidebar: React.ReactNode
    userName: string
    variant: "citizen" | "admin"
    notifCount: number
    pendingCount: number
}) {
    const { isCollapsed } = useSidebar()

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-background">
            <TopNavbar
                userName={userName}
                variant={variant}
                notifCount={notifCount}
                pendingCount={pendingCount}
            />
            <div className="flex flex-1 overflow-hidden pt-14">
                {/* Sidebar */}
                <div
                    className={`flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? "w-16" : "w-64"
                        }`}
                >
                    {sidebar}
                </div>
                {/* Main content */}
                <main className="flex-1 overflow-auto">
                    <div className="min-h-full p-4 lg:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
