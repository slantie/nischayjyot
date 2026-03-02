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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GrievanceTimelineRealtime } from "@/components/grievance/grievance-timeline-realtime"
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
        </div>
    )
}
