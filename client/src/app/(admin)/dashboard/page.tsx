import type { Metadata } from "next"
import { createAdminClient } from "@/lib/supabase/admin"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
    GRIEVANCE_STATUS_COLORS,
    GRIEVANCE_STATUS_LABELS,
    GRIEVANCE_CATEGORY_LABELS,
    VIOLATION_TYPE_LABELS,
    PAYMENT_STATUS_COLORS,
    PAYMENT_STATUS_LABELS,
} from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
    FileText,
    Clock,
    Check,
    AlertTriangle,
    Car,
    TrendingUp,
    ArrowRight,
    Users,
} from "lucide-react"
import type { GrievanceStatus } from "@/lib/supabase/types"

export const metadata: Metadata = { title: "Admin Dashboard" }

export default async function AdminDashboardPage() {
    const admin = createAdminClient()

    const slaThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Parallel fetch all analytics
    const [
        { count: totalGrievances },
        { count: openGrievances },
        { count: resolvedGrievances },
        { count: totalChallans },
        { count: unpaidChallans },
        { count: totalCitizens },
        { count: slaBreached },
        { data: recentGrievances },
        { data: statusBreakdown },
        { data: cityBreakdown },
    ] = await Promise.all([
        admin.from("grievances").select("id", { count: "exact", head: true }),
        admin.from("grievances").select("id", { count: "exact", head: true }).in("status", ["open", "in_progress", "under_review"]),
        admin.from("grievances").select("id", { count: "exact", head: true }).eq("status", "resolved"),
        admin.from("challans").select("id", { count: "exact", head: true }),
        admin.from("challans").select("id", { count: "exact", head: true }).eq("payment_status", "unpaid"),
        admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "citizen"),
        admin.from("grievances").select("id", { count: "exact", head: true })
            .in("status", ["open", "in_progress", "under_review"])
            .lt("created_at", slaThreshold),
        admin.from("grievances")
            .select("id, ticket_number, category, status, priority, created_at, profiles!citizen_id(full_name)")
            .order("created_at", { ascending: false })
            .limit(8),
        admin.from("grievances").select("status"),
        admin.from("challans").select("city").limit(500),
    ])

    // Status breakdown for mini chart
    const statusCounts = (statusBreakdown ?? []).reduce<Record<string, number>>((acc, g) => {
        const s = g.status as string
        acc[s] = (acc[s] ?? 0) + 1
        return acc
    }, {})

    // City breakdown
    const cityCounts = (cityBreakdown ?? []).reduce<Record<string, number>>((acc, c) => {
        const city = c.city as string
        acc[city] = (acc[city] ?? 0) + 1
        return acc
    }, {})
    const topCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
    const maxCityCount = topCities[0]?.[1] ?? 1

    const resolutionRate = totalGrievances
        ? Math.round(((resolvedGrievances ?? 0) / (totalGrievances ?? 1)) * 100)
        : 0

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="mt-1 text-muted-foreground text-sm">
                    Overview of NishchayJyot grievance operations
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard title="Total Grievances" value={totalGrievances ?? 0} icon={FileText} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-950/30" delta={`${openGrievances ?? 0} pending`} />
                <KpiCard title="Resolved" value={resolvedGrievances ?? 0} icon={Check} color="text-green-600" bg="bg-green-50 dark:bg-green-950/30" delta={`${resolutionRate}% resolution rate`} />
                <KpiCard title="Total Challans" value={totalChallans ?? 0} icon={Car} color="text-purple-600" bg="bg-purple-50 dark:bg-purple-950/30" delta={`${unpaidChallans ?? 0} unpaid`} />
                <KpiCard title="SLA Breached" value={slaBreached ?? 0} icon={AlertTriangle} color="text-red-600" bg="bg-red-50 dark:bg-red-950/30" delta="open &gt;7 days — action needed" alert />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Status Breakdown */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Grievance Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {(["open", "in_progress", "under_review", "resolved", "rejected", "escalated"] as GrievanceStatus[]).map((s) => {
                            const count = statusCounts[s] ?? 0
                            const total = totalGrievances ?? 1
                            const pct = Math.round((count / total) * 100)
                            return (
                                <div key={s}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${GRIEVANCE_STATUS_COLORS[s]}`}>
                                            {GRIEVANCE_STATUS_LABELS[s]}
                                        </span>
                                        <span className="text-sm font-semibold">{count}</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                {/* City Breakdown */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Car className="h-4 w-4 text-primary" />
                            Challans by City
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {topCities.map(([city, count]) => (
                            <div key={city}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm">{city}</span>
                                    <span className="text-sm font-semibold">{count}</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-violet-500 transition-all"
                                        style={{ width: `${Math.round((count / maxCityCount) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        {topCities.length === 0 && (
                            <p className="text-sm text-muted-foreground">No challan data yet</p>
                        )}
                    </CardContent>
                </Card>

                {/* Urgent Alert */}
                <Card className="lg:col-span-1 border-orange-200 dark:border-orange-800/50">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            Action Required
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/50 p-3">
                            <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">{openGrievances ?? 0} open grievances</p>
                            <p className="text-xs text-orange-700 dark:text-orange-300 mt-0.5">Require assignment and review</p>
                        </div>
                        <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 p-3">
                            <p className="text-sm font-semibold text-red-900 dark:text-red-100">{unpaidChallans ?? 0} unpaid challans</p>
                            <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">May be escalated to virtual court</p>
                        </div>
                        <Link
                            href="/manage-grievances"
                            className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                        >
                            View all grievances <ArrowRight className="h-3 w-3" />
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Grievances Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Recent Grievances</CardTitle>
                    <Link href="/manage-grievances" className="text-sm text-primary hover:underline flex items-center gap-1">
                        View all <ArrowRight className="h-3 w-3" />
                    </Link>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ticket</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Citizen</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {(recentGrievances ?? []).map((g) => {
                                    const citizen = g.profiles as { full_name: string } | null
                                    return (
                                        <tr key={g.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 font-mono text-xs font-medium">#{g.ticket_number}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{citizen?.full_name ?? "—"}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{GRIEVANCE_CATEGORY_LABELS[g.category]}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${GRIEVANCE_STATUS_COLORS[g.status as GrievanceStatus]}`}>
                                                    {GRIEVANCE_STATUS_LABELS[g.status as GrievanceStatus]}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{formatDate(g.created_at)}</td>
                                            <td className="px-4 py-3 text-right">
                                                <Link href={`/manage-grievances/${g.id}`} className="text-xs text-primary hover:underline">
                                                    Review →
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {(!recentGrievances || recentGrievances.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground text-sm">
                                            No grievances yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function KpiCard({
    title, value, icon: Icon, color, bg, delta, alert: isAlert
}: {
    title: string; value: number; icon: React.ElementType; color: string; bg: string; delta?: string; alert?: boolean
}) {
    return (
        <Card className={isAlert && value > 0 ? "border-red-300 dark:border-red-800" : ""}>
            <CardContent className="flex items-center gap-4 p-6">
                <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                    {isAlert && value > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                        </span>
                    )}
                </div>
                <div>
                    <p className={`text-2xl font-bold ${isAlert && value > 0 ? "text-red-600" : ""}`}>
                        {value.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    {delta && <p className="text-xs text-muted-foreground/70 mt-0.5">{delta}</p>}
                </div>
            </CardContent>
        </Card>
    )
}
