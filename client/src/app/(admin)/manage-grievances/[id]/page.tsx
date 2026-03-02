import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import { formatDateTime, formatCurrency } from "@/lib/utils"
import {
    GRIEVANCE_STATUS_COLORS,
    GRIEVANCE_STATUS_LABELS,
    GRIEVANCE_CATEGORY_LABELS,
    PRIORITY_COLORS,
    PRIORITY_LABELS,
    VIOLATION_TYPE_LABELS,
    PAYMENT_STATUS_LABELS,
    PAYMENT_STATUS_COLORS,
} from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
    ArrowLeft,
    User,
    Car,
    Clock,
    ShieldCheck,
    Bot,
} from "lucide-react"
import { GrievanceStatusUpdater } from "@/components/grievance/status-updater"
import type {
    Grievance,
    Profile,
    Challan,
    GrievanceTimeline,
    GrievanceStatus,
    PriorityLevel,
} from "@/lib/supabase/types"

export const metadata: Metadata = { title: "Review Grievance" }

// ── Local joined type ──────────────────────────────────────────────────────────
// Supabase's join inference collapses `*` fields when mixed with named joins.
// We define the full shape explicitly and cast via unknown.
type GrievanceDetail = Grievance & {
    profiles: Pick<Profile, "full_name" | "phone" | "vehicle_number" | "dl_number"> | null
    challans: Pick<Challan,
        "challan_number" | "violation_type" | "fine_amount" | "city" | "payment_status" | "challan_date" | "violation_place"
    > | null
    grievance_timeline: Pick<GrievanceTimeline, "id" | "action" | "actor_role" | "created_at">[]
}

export default async function GrievanceReviewPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const admin = createAdminClient()

    const { data, error } = await admin
        .from("grievances")
        .select(`
      *,
      profiles!citizen_id(full_name, phone, vehicle_number, dl_number),
      challans(challan_number, violation_type, fine_amount, city, payment_status, challan_date, violation_place),
      grievance_timeline(id, action, actor_role, created_at)
    `)
        .eq("id", id)
        .single()

    if (error || !data) notFound()

    // Cast via unknown — base `*` fields get dropped in Supabase's inference
    // when mixed with named join columns, but they are present at runtime.
    const grievance = data as unknown as GrievanceDetail
    const citizen = grievance.profiles
    const challan = grievance.challans
    const timeline = grievance.grievance_timeline ?? []

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Breadcrumb */}
            <Link
                href="/manage-grievances"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Grievances
            </Link>

            {/* Header */}
            <div className="flex items-start flex-wrap gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                        <h1 className="text-2xl font-bold">Ticket #{grievance.ticket_number}</h1>
                        <Badge
                            variant="outline"
                            className={GRIEVANCE_STATUS_COLORS[grievance.status as GrievanceStatus]}
                        >
                            {GRIEVANCE_STATUS_LABELS[grievance.status as GrievanceStatus]}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={PRIORITY_COLORS[grievance.priority as PriorityLevel]}
                        >
                            {PRIORITY_LABELS[grievance.priority as PriorityLevel]} Priority
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Filed {formatDateTime(grievance.created_at)}
                        {" · "}
                        {GRIEVANCE_CATEGORY_LABELS[grievance.category]}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* ── Left col ── */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Grievance Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Grievance Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                                    Description
                                </p>
                                <p className="text-sm">{grievance.description}</p>
                            </div>

                            {grievance.challan_number && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                                            Challan Reference
                                        </p>
                                        <p className="text-sm font-mono">{grievance.challan_number}</p>
                                    </div>
                                </>
                            )}

                            {grievance.resolution_notes && (
                                <>
                                    <Separator />
                                    <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 p-3">
                                        <p className="text-xs font-medium uppercase tracking-wide text-green-700 dark:text-green-300 mb-1">
                                            Resolution Notes
                                        </p>
                                        <p className="text-sm text-green-900 dark:text-green-100">
                                            {grievance.resolution_notes}
                                        </p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Challan Info */}
                    {challan && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Car className="h-4 w-4" /> Linked Challan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <DetailItem label="Challan No." value={challan.challan_number} mono />
                                    <DetailItem
                                        label="Violation"
                                        value={VIOLATION_TYPE_LABELS[challan.violation_type] ?? challan.violation_type}
                                    />
                                    <DetailItem label="Fine Amount" value={formatCurrency(Number(challan.fine_amount))} />
                                    <DetailItem label="City" value={challan.city} />
                                    <DetailItem label="Date" value={formatDateTime(challan.challan_date)} />
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Payment</p>
                                        <Badge
                                            variant="outline"
                                            className={PAYMENT_STATUS_COLORS[challan.payment_status]}
                                        >
                                            {PAYMENT_STATUS_LABELS[challan.payment_status]}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Update Status */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-primary" /> Update Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <GrievanceStatusUpdater
                                grievanceId={grievance.id}
                                currentStatus={grievance.status as GrievanceStatus}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* ── Right col ── */}
                <div className="space-y-4">
                    {/* Citizen Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <User className="h-4 w-4" /> Citizen
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <DetailItem label="Name" value={citizen?.full_name ?? "—"} />
                            <DetailItem label="Phone" value={citizen?.phone ?? "—"} />
                            {citizen?.vehicle_number && (
                                <DetailItem label="Vehicle" value={citizen.vehicle_number} mono />
                            )}
                            {citizen?.dl_number && (
                                <DetailItem label="DL No." value={citizen.dl_number} mono />
                            )}
                            <DetailItem label="Lodged Via" value={grievance.lodged_via} />
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {timeline.length === 0 ? (
                                <p className="text-xs text-muted-foreground">No timeline entries yet</p>
                            ) : (
                                <div className="relative space-y-3 before:absolute before:left-3.75 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
                                    {timeline.map((entry) => (
                                        <div key={entry.id} className="flex gap-3">
                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background">
                                                {entry.actor_role === "citizen" ? (
                                                    <User className="h-3 w-3 text-primary" />
                                                ) : entry.actor_role === "admin" || entry.actor_role === "super_admin" ? (
                                                    <ShieldCheck className="h-3 w-3 text-green-600" />
                                                ) : (
                                                    <Bot className="h-3 w-3 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 pb-3">
                                                <p className="text-xs font-medium">{entry.action}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDateTime(entry.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function DetailItem({
    label,
    value,
    mono = false,
}: {
    label: string
    value: string
    mono?: boolean
}) {
    return (
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`text-sm mt-0.5 ${mono ? "font-mono" : "font-medium"}`}>{value}</p>
        </div>
    )
}
