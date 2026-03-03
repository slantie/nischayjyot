import type { Metadata } from "next"
import { createAdminClient } from "@/lib/supabase/admin"
import { formatDate } from "@/lib/utils"
import {
    GRIEVANCE_STATUS_COLORS,
    GRIEVANCE_STATUS_LABELS,
    GRIEVANCE_CATEGORY_LABELS,
    PRIORITY_COLORS,
    PRIORITY_LABELS,
} from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Download, Search, X, AlertTriangle } from "lucide-react"
import type { Grievance, GrievanceStatus, PriorityLevel, Profile } from "@/lib/supabase/types"

export const metadata: Metadata = { title: "Manage Grievances" }

const ACTIVE_STATUSES = new Set(["open", "in_progress", "under_review", "escalated"])
const SLA_MS = 7 * 24 * 60 * 60 * 1000

function isSLABreached(createdAt: string, status: string) {
    return ACTIVE_STATUSES.has(status) && Date.now() - new Date(createdAt).getTime() > SLA_MS
}

const STATUS_OPTIONS = [
    { value: "", label: "All" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "under_review", label: "Under Review" },
    { value: "escalated", label: "Escalated" },
    { value: "resolved", label: "Resolved" },
    { value: "rejected", label: "Rejected" },
    { value: "sla_breached", label: "⚠ SLA Breached" },
]

type GrievanceRow = Pick<Grievance,
    "id" | "ticket_number" | "category" | "status" | "priority" | "created_at"
> & { profiles: Pick<Profile, "full_name" | "phone"> | null }

export default async function ManageGrievancesPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; page?: string; q?: string }>
}) {
    const { status = "", page = "1", q = "" } = await searchParams
    const admin = createAdminClient()

    const pageNum = Math.max(1, parseInt(page))
    const pageSize = 15
    const from = (pageNum - 1) * pageSize
    const to = from + pageSize - 1

    let query = admin
        .from("grievances")
        .select(`id, ticket_number, category, status, priority, created_at, profiles!citizen_id(full_name, phone)`, { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to)

    if (status === "sla_breached") {
        const slaThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        query = query
            .in("status", ["open", "in_progress", "under_review", "escalated"])
            .lt("created_at", slaThreshold)
    } else if (status) {
        query = query.eq("status", status as GrievanceStatus)
    }

    // Text search across ticket_number and description
    if (q) {
        query = query.or(`description.ilike.%${q}%,challan_number.ilike.%${q}%`)
    }

    const { data, count } = await query
    const grievances = (data ?? []) as unknown as GrievanceRow[]
    const totalPages = Math.ceil((count ?? 0) / pageSize)

    function buildHref(overrides: Record<string, string>) {
        const params = new URLSearchParams({
            ...(status ? { status } : {}),
            ...(q ? { q } : {}),
            page: String(pageNum),
            ...overrides,
        })
        const str = params.toString()
        return `/manage-grievances${str ? `?${str}` : ""}`
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Manage Grievances</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {count ?? 0} total{status ? ` · filtered by "${STATUS_OPTIONS.find(o => o.value === status)?.label}"` : ""}
                        {q ? ` · searching "${q}"` : ""}
                    </p>
                </div>
                <Button variant="outline" size="sm" asChild className="gap-1.5">
                    <Link href="/manage-grievances/export">
                        <Download className="h-3.5 w-3.5" /> Export CSV
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Search box */}
                <form method="GET" className="relative w-full sm:max-w-xs">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                        name="q"
                        defaultValue={q}
                        placeholder="Search by challan no., description…"
                        className="h-9 w-full rounded-md border bg-background pl-8 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {/* Preserve status in hidden input */}
                    {status && <input type="hidden" name="status" value={status} />}
                    {q && (
                        <Link
                            href={buildHref({ q: "", page: "1" })}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3.5 w-3.5" />
                        </Link>
                    )}
                </form>

                {/* Status filter tabs */}
                <div className="flex flex-wrap gap-1.5">
                    {STATUS_OPTIONS.map((opt) => (
                        <Link
                            key={opt.value}
                            href={buildHref({ status: opt.value, page: "1" })}
                        >
                            <Badge
                                variant={status === opt.value ? "default" : "outline"}
                                className="cursor-pointer text-xs"
                            >
                                {opt.label}
                            </Badge>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ticket</TableHead>
                            <TableHead>Citizen</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {grievances.map((g) => {
                            const breached = isSLABreached(g.created_at, g.status)
                            return (
                            <TableRow key={g.id} className={breached ? "bg-red-50/40 dark:bg-red-950/10" : ""}>
                                <TableCell className="font-mono text-xs font-semibold">
                                    <div className="flex items-center gap-1.5">
                                        #{g.ticket_number}
                                        {breached && (
                                            <span title="SLA breached — open &gt;7 days">
                                                <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="font-medium">{g.profiles?.full_name ?? "—"}</p>
                                    <p className="text-xs text-muted-foreground">{g.profiles?.phone}</p>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {GRIEVANCE_CATEGORY_LABELS[g.category]}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={PRIORITY_COLORS[g.priority as PriorityLevel]}>
                                        {PRIORITY_LABELS[g.priority as PriorityLevel]}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={GRIEVANCE_STATUS_COLORS[g.status as GrievanceStatus]}>
                                        {GRIEVANCE_STATUS_LABELS[g.status as GrievanceStatus]}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {formatDate(g.created_at)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/manage-grievances/${g.id}`}>Review →</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )})}
                        {grievances.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                                    {q ? `No grievances matching "${q}"` : "No grievances found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between text-sm">
                    <p className="text-muted-foreground">
                        Page {pageNum} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        {pageNum > 1 && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={buildHref({ page: String(pageNum - 1) })}>Previous</Link>
                            </Button>
                        )}
                        {pageNum < totalPages && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={buildHref({ page: String(pageNum + 1) })}>Next</Link>
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
