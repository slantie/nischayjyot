'use client'

import { TopNavbar } from "@/components/layout/top-navbar"

export function DashboardShell({
    children,
    userName,
    variant,
    notifCount = 0,
    pendingCount = 0,
}: {
    children: React.ReactNode
    userName: string
    variant: "citizen" | "admin"
    notifCount?: number
    pendingCount?: number
}) {
    return (
        <div className="min-h-screen bg-background">
            <TopNavbar
                userName={userName}
                variant={variant}
                notifCount={notifCount}
                pendingCount={pendingCount}
            />
            <main className="pt-14">
                <div className="p-4 lg:p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
