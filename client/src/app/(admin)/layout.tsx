import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/layout/dashboard-shell"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const admin = createAdminClient()
    const { data: profiles } = await admin
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .limit(1)

    const profile = profiles?.[0]

    if (!profile || !["admin", "super_admin"].includes(profile.role)) {
        redirect("/home")
    }

    const { count: pendingCount } = await admin
        .from("grievances")
        .select("id", { count: "exact", head: true })
        .in("status", ["open", "in_progress", "under_review"])

    return (
        <DashboardShell
            variant="admin"
            userName={profile.full_name}
            pendingCount={pendingCount ?? 0}
        >
            {children}
        </DashboardShell>
    )
}
