import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getChallansForUser } from "@/actions/challans"
import { getGrievances } from "@/actions/grievances"
import { getNotifications } from "@/actions/notifications"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
    GRIEVANCE_STATUS_COLORS,
    GRIEVANCE_STATUS_LABELS,
    PAYMENT_STATUS_COLORS,
    PAYMENT_STATUS_LABELS,
    VIOLATION_TYPE_LABELS,
} from "@/lib/constants"
import type { Grievance, Challan, Notification } from "@/lib/supabase/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    FileText,
    Check,
    Clock,
    Bot,
    AlertTriangle,
    Bell,
    ArrowRight,
    Car,
    Plus,
} from "lucide-react"
import { ChallanLookupWidget } from "@/components/citizen/challan-lookup"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Dashboard",
}

export default async function CitizenHomePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, vehicle_number")
        .eq("id", user.id)
        .single()

    const [{ data: rawGrievances }, { data: rawChallans }, { data: rawNotifications }] = await Promise.all([
        getGrievances(1, 100),
        getChallansForUser(),
        getNotifications(true),
    ])

    const grievances = (rawGrievances ?? []) as unknown as Pick<
        Grievance,
        "id" | "ticket_number" | "status" | "category" | "description" | "created_at" | "challan_number"
    >[]
    const challans = (rawChallans ?? []) as unknown as Challan[]
    const unreadNotifications = (rawNotifications ?? []) as unknown as Notification[]

    const totalGrievances = grievances.length
    const closedGrievances = grievances.filter((g) => g.status === "resolved" || g.status === "rejected").length
    const pendingGrievances = grievances.filter((g) => g.status !== "resolved" && g.status !== "rejected").length
    const unpaidChallans = challans.filter((c) => c.payment_status === "unpaid")

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Welcome back, {profile?.full_name?.split(" ")[0] ?? "Citizen"} 👋
                </h1>
                <p className="mt-1 text-muted-foreground">
                    {profile?.vehicle_number
                        ? `Showing grievances and challans for vehicle ${profile.vehicle_number}`
                        : "Manage your ONOC challan grievances"}
                </p>
            </div>

            {/* Alert: Unread Notifications */}
            {unreadNotifications.length > 0 && (
                <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <Bell className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                            {unreadNotifications.length} unread notification{unreadNotifications.length > 1 ? "s" : ""}
                        </p>
                        <p className="text-sm text-muted-foreground truncate mt-0.5">
                            {unreadNotifications[0]?.title}
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/notifications">View all</Link>
                    </Button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                    title="Total Grievances"
                    value={totalGrievances}
                    icon={FileText}
                    color="text-blue-600"
                    bg="bg-blue-50 dark:bg-blue-950/30"
                />
                <StatCard
                    title="Grievances Closed"
                    value={closedGrievances}
                    icon={Check}
                    color="text-green-600"
                    bg="bg-green-50 dark:bg-green-950/30"
                />
                <StatCard
                    title="Grievances Pending"
                    value={pendingGrievances}
                    icon={Clock}
                    color="text-yellow-600"
                    bg="bg-yellow-50 dark:bg-yellow-950/30"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid gap-3 sm:grid-cols-3">
                <Link href="/chatbot" className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 ring-1 ring-primary/15 group-hover:bg-primary/12">
                        <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold">AI Assistant</p>
                        <p className="text-xs text-muted-foreground">Lodge via chatbot</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                </Link>
                <Link href="/new-grievance" className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 ring-1 ring-green-200 group-hover:bg-green-100">
                        <Plus className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold">New Grievance</p>
                        <p className="text-xs text-muted-foreground">Direct form</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/50 group-hover:text-green-600 transition-colors" />
                </Link>
                <Link href="/track-grievance" className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border group-hover:bg-muted/80">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold">Track Grievances</p>
                        <p className="text-xs text-muted-foreground">View all tickets</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                </Link>
            </div>

            {/* Challan Lookup */}
            <ChallanLookupWidget />

            {/* Pending Payments */}
            {unpaidChallans.length > 0 && (
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-semibold">
                            <span className="inline-flex items-center gap-1.5">
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                                Pending Payments ({unpaidChallans.length})
                            </span>
                        </h2>
                    </div>
                    <div className="overflow-hidden rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Challan No.</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Violation</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Fine</th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {unpaidChallans.slice(0, 5).map((c) => (
                                    <tr key={c.id} className="transition-colors hover:bg-muted/30">
                                        <td className="px-4 py-3 font-mono text-xs">{c.challan_number}</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {VIOLATION_TYPE_LABELS[c.violation_type]}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {formatDate(c.challan_date)}
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold">
                                            {formatCurrency(Number(c.fine_amount))}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${PAYMENT_STATUS_COLORS[c.payment_status]}`}
                                            >
                                                {PAYMENT_STATUS_LABELS[c.payment_status]}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* Recent Grievances */}
            {grievances && grievances.length > 0 ? (
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-semibold">Recent Grievances</h2>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/track-grievance" className="gap-1 text-xs">
                                View all <ArrowRight className="h-3 w-3" />
                            </Link>
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {grievances.slice(0, 4).map((g) => (
                            <Link
                                key={g.id}
                                href={`/track-grievance/${g.id}`}
                                className="block rounded-lg border p-4 transition-shadow hover:shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="font-medium text-sm">Ticket #{g.ticket_number}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{g.description}</p>
                                    </div>
                                    <span
                                        className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${GRIEVANCE_STATUS_COLORS[g.status]}`}
                                    >
                                        {GRIEVANCE_STATUS_LABELS[g.status]}
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">{formatDate(g.created_at)}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            ) : (
                <div className="rounded-xl border border-dashed p-10 text-center">
                    <Car className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                    <p className="font-medium">No grievances yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Use our AI chatbot or file a manual grievance to get started.
                    </p>
                    <Button className="mt-4 gap-2" asChild>
                        <Link href="/chatbot">
                            <Bot className="h-4 w-4" /> Start with AI Chatbot
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    )
}

function StatCard({
    title,
    value,
    icon: Icon,
    color,
    bg,
}: {
    title: string
    value: number
    icon: React.ElementType
    color: string
    bg: string
}) {
    return (
        <Card>
            <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <div>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-sm text-muted-foreground">{title}</p>
                </div>
            </CardContent>
        </Card>
    )
}
