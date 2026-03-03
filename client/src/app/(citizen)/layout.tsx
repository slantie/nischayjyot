import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { getNotifications } from "@/actions/notifications"

export default async function CitizenLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/login")

    const { data: profiles } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .limit(1)

    const profile = profiles?.[0]

    if (profile?.role === "admin" || profile?.role === "super_admin") {
        redirect("/dashboard")
    }

    const { data: notifications } = await getNotifications(true)
    const unreadCount = notifications?.length ?? 0

    return (
        <DashboardShell
            variant="citizen"
            userName={profile?.full_name ?? "Citizen"}
            notifCount={unreadCount}
        >
            {children}
        </DashboardShell>
    )
}
