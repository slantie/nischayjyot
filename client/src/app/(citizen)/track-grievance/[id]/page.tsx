import type { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getGrievanceById } from "@/actions/grievances"
import { formatDateTime } from "@/lib/utils"
import {
    GRIEVANCE_STATUS_COLORS,
    GRIEVANCE_STATUS_LABELS,
    GRIEVANCE_CATEGORY_LABELS,
    PRIORITY_LABELS,
    PRIORITY_COLORS,
} from "@/lib/constants"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { GrievanceTimelineRealtime } from "@/components/grievance/grievance-timeline-realtime"
import { EvidenceViewer } from "@/components/grievance/evidence-viewer"
import { Scale, ExternalLink } from "lucide-react"
import type { Grievance, GrievanceStatus, PriorityLevel } from "@/lib/supabase/types"

export const metadata: Metadata = { title: "Grievance Detail" }

type TimelineEntry = {
    id: string
    action: string
    actor_role: string | null
    created_at: string
}

type GrievanceWithTimeline = Grievance & {
    grievance_timeline: TimelineEntry[]
}

export default async function GrievanceDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data, error } = await getGrievanceById(id)
    if (error || !data) notFound()

    const grievance = data as unknown as GrievanceWithTimeline
    const timeline = grievance.grievance_timeline ?? []

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h1 className="text-2xl font-bold tracking-tight">Ticket #{grievance.ticket_number}</h1>
                    <Badge className={`${GRIEVANCE_STATUS_COLORS[grievance.status as GrievanceStatus]} border`}>
                        {GRIEVANCE_STATUS_LABELS[grievance.status as GrievanceStatus]}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                    Filed {formatDateTime(grievance.created_at)} · {GRIEVANCE_CATEGORY_LABELS[grievance.category]}
                </p>
            </div>

            {/* Details Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Grievance Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Description</p>
                        <p className="text-sm">{grievance.description}</p>
                    </div>

                    {grievance.challan_number && (
                        <>
                            <Separator />
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Challan Number</p>
                                <p className="text-sm font-mono">{grievance.challan_number}</p>
                            </div>
                        </>
                    )}

                    <Separator />
                    <div className="flex gap-6">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Priority</p>
                            <Badge variant="outline" className={PRIORITY_COLORS[grievance.priority as PriorityLevel]}>
                                {PRIORITY_LABELS[grievance.priority as PriorityLevel]}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Lodged Via</p>
                            <p className="text-sm capitalize">{grievance.lodged_via}</p>
                        </div>
                    </div>

                    {grievance.evidence_urls && grievance.evidence_urls.length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                                    Evidence Submitted ({grievance.evidence_urls.length} file{grievance.evidence_urls.length > 1 ? "s" : ""})
                                </p>
                                <EvidenceViewer urls={grievance.evidence_urls} />
                            </div>
                        </>
                    )}

                    {grievance.resolution_notes && (
                        <>
                            <Separator />
                            <div className="rounded-lg bg-muted/50 p-3">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Resolution Notes</p>
                                <p className="text-sm">{grievance.resolution_notes}</p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Timeline — realtime updates via Supabase */}
            <div>
                <h2 className="font-semibold mb-4">Timeline</h2>
                <GrievanceTimelineRealtime
                    grievanceId={grievance.id}
                    initialTimeline={timeline}
                />
            </div>

            {/* VTC Appeal CTA — show when rejected or escalated */}
            {(grievance.status === "rejected" || grievance.status === "escalated") && (
                <Card className="border-amber-200 bg-amber-50/60 dark:border-amber-800/50 dark:bg-amber-950/20">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Scale className="h-5 w-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                                    {grievance.status === "rejected"
                                        ? "Disagree with this decision?"
                                        : "Grievance escalated — next steps"}
                                </p>
                                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                                    You may request a review through the Virtual Traffic Court (VTC) portal under the ONOC framework.
                                    Keep your ticket number <span className="font-mono font-semibold">#{grievance.ticket_number}</span> handy when filing.
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-amber-400 text-amber-800 hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-amber-900/40"
                                        asChild
                                    >
                                        <a
                                            href="https://echallan.parivahan.gov.in/index/accused-challan"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Appeal via e-Challan Portal
                                            <ExternalLink className="ml-1.5 h-3 w-3" />
                                        </a>
                                    </Button>
                                    <Button size="sm" variant="link" className="text-amber-700 dark:text-amber-400 px-0" asChild>
                                        <Link href="/faq">View FAQ →</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
