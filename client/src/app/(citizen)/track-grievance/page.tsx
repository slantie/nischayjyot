import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getGrievances } from "@/actions/grievances"
import { formatDate } from "@/lib/utils"
import { GRIEVANCE_STATUS_COLORS, GRIEVANCE_STATUS_LABELS, GRIEVANCE_CATEGORY_LABELS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Bot, Plus, Search, X } from "lucide-react"
import type { Grievance } from "@/lib/supabase/types"

export const metadata: Metadata = { title: "My Grievances" }

type GrievanceRow = Pick<
    Grievance,
    "id" | "ticket_number" | "status" | "category" | "description" | "created_at" | "challan_number"
>

export default async function TrackGrievancePage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; status?: string }>
}) {
    const { q = "", status = "" } = await searchParams
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data, error } = await getGrievances(1, 100)
    let grievances = (data ?? []) as unknown as GrievanceRow[]

    // Client-side filtering (all loaded in one fetch)
    if (q) {
        const lower = q.toLowerCase()
        grievances = grievances.filter(
            (g) =>
                String(g.ticket_number).includes(lower) ||
                g.description?.toLowerCase().includes(lower) ||
                g.challan_number?.toLowerCase().includes(lower) ||
                GRIEVANCE_CATEGORY_LABELS[g.category]?.toLowerCase().includes(lower)
        )
    }
    if (status) {
        grievances = grievances.filter((g) => g.status === status)
    }

    const STATUS_TABS = [
        { value: "", label: "All" },
        { value: "open", label: "Open" },
        { value: "in_progress", label: "In Progress" },
        { value: "under_review", label: "Under Review" },
        { value: "resolved", label: "Resolved" },
        { value: "rejected", label: "Rejected" },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Grievances</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Track all your submitted challan grievances
                    </p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild className="gap-1.5">
                        <Link href="/new-grievance">
                            <Plus className="h-3.5 w-3.5" /> New Grievance
                        </Link>
                    </Button>
                    <Button size="sm" asChild className="gap-1.5">
                        <Link href="/chatbot">
                            <Bot className="h-3.5 w-3.5" /> AI Assistant
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Filters row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Search box */}
                <form method="GET" className="relative w-full sm:max-w-xs">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                        name="q"
                        defaultValue={q}
                        placeholder="Search ticket, challan, description…"
                        className="h-9 w-full rounded-md border bg-background pl-8 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {q && (
                        <Link
                            href={`/track-grievance${status ? `?status=${status}` : ""}`}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3.5 w-3.5" />
                        </Link>
                    )}
                </form>

                {/* Status tabs */}
                <div className="flex flex-wrap gap-1.5">
                    {STATUS_TABS.map((tab) => (
                        <Link
                            key={tab.value}
                            href={`/track-grievance?${new URLSearchParams({ ...(q ? { q } : {}), ...(tab.value ? { status: tab.value } : {}) })}`}
                        >
                            <Badge
                                variant={status === tab.value ? "default" : "outline"}
                                className="cursor-pointer text-xs"
                            >
                                {tab.label}
                            </Badge>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Results */}
            {error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                    Failed to load grievances: {error}
                </div>
            ) : grievances.length === 0 ? (
                <div className="rounded-xl border border-dashed p-12 text-center">
                    <FileText className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                    {q || status ? (
                        <>
                            <p className="font-medium">No matching grievances</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Try adjusting your search or filter.
                            </p>
                            <Button variant="outline" className="mt-4" asChild>
                                <Link href="/track-grievance">Clear filters</Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <p className="font-medium">No grievances yet</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Use the AI chatbot or the form to lodge your first grievance.
                            </p>
                            <div className="mt-4 flex justify-center gap-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/new-grievance"><Plus className="mr-1.5 h-4 w-4" />New Grievance</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/chatbot"><Bot className="mr-1.5 h-4 w-4" />AI Chatbot</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <>
                    {(q || status) && (
                        <p className="text-sm text-muted-foreground">
                            {grievances.length} result{grievances.length !== 1 ? "s" : ""}{q ? ` for "${q}"` : ""}
                        </p>
                    )}
                    <div className="space-y-3">
                        {grievances.map((g) => (
                            <Link key={g.id} href={`/track-grievance/${g.id}`}>
                                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <span className="text-sm font-semibold">
                                                        Ticket #{g.ticket_number}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {GRIEVANCE_CATEGORY_LABELS[g.category]}
                                                    </Badge>
                                                </div>
                                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                                    {g.description}
                                                </p>
                                                {g.challan_number && (
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Challan:{" "}
                                                        <span className="font-mono">{g.challan_number}</span>
                                                    </p>
                                                )}
                                            </div>
                                            <div className="shrink-0 space-y-1.5 text-right">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${GRIEVANCE_STATUS_COLORS[g.status]}`}
                                                >
                                                    {GRIEVANCE_STATUS_LABELS[g.status]}
                                                </span>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(g.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
