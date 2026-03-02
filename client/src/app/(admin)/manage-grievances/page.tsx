import type { Metadata } from "next"
import { createAdminClient } from "@/lib/supabase/admin"
import { formatCurrency, formatDate } from "@/lib/utils"
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
import { Filter } from "lucide-react"
import type { Grievance, GrievanceStatus, PriorityLevel, Profile } from "@/lib/supabase/types"

export const metadata: Metadata = { title: "Manage Grievances" }

const STATUS_OPTIONS = [
    { value: "", label: "All" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "under_review", label: "Under Review" },
    { value: "escalated", label: "Escalated" },
    { value: "resolved", label: "Resolved" },
    { value: "rejected", label: "Rejected" },
]

type GrievanceRow = Pick<Grievance,
    "id" | "ticket_number" | "category" | "status" | "priority" | "created_at"
> & { profiles: Pick<Profile, "full_name" | "phone"> | null }

export default async function ManageGrievancesPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; page?: string }>
}) {
    const { status = "", page = "1" } = await searchParams
    const admin = createAdminClient()

    const pageNum = Math.max(1, parseInt(page))
    const pageSize = 15
    const from = (pageNum - 1) * pageSize
    const to = from + pageSize - 1

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = admin
        .from("grievances")
        .select(`id, ticket_number, category, status, priority, created_at, profiles!citizen_id(full_name, phone)`, { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to)

    if (status) {
        query = query.eq("status", status as GrievanceStatus)
    }

    const { data, count } = await query
    const grievances = (data ?? []) as unknown as GrievanceRow[]
    const totalPages = Math.ceil((count ?? 0) / pageSize)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Manage Grievances</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{count ?? 0} total grievances</p>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {STATUS_OPTIONS.map((opt) => (
                    <Link
                        key={opt.value}
                        href={`/manage-grievances${opt.value ? `?status=${opt.value}` : ""}`}
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

            {/* Table */}
            <div className="rounded-lg border overflow-hidden">
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
                        {grievances.map((g) => (
                            <TableRow key={g.id}>
                                <TableCell className="font-mono text-xs font-semibold">#{g.ticket_number}</TableCell>
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
                                <TableCell className="text-muted-foreground">{formatDate(g.created_at)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/manage-grievances/${g.id}`}>Review →</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {grievances.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                                    No grievances found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between text-sm">
                    <p className="text-muted-foreground">Page {pageNum} of {totalPages}</p>
                    <div className="flex gap-2">
                        {pageNum > 1 && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/manage-grievances?${new URLSearchParams({ ...(status ? { status } : {}), page: String(pageNum - 1) })}`}>
                                    Previous
                                </Link>
                            </Button>
                        )}
                        {pageNum < totalPages && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/manage-grievances?${new URLSearchParams({ ...(status ? { status } : {}), page: String(pageNum + 1) })}`}>
                                    Next
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
