'use client'

import { useEffect, useState } from "react"
import { useRealtimeGrievance } from "@/hooks/use-realtime-grievance"
import { formatDateTime } from "@/lib/utils"
import { Clock, User, Bot, ShieldCheck } from "lucide-react"

type TimelineEntry = {
    id: string
    action: string
    actor_role: string | null
    created_at: string
}

type Props = {
    grievanceId: string
    initialTimeline: TimelineEntry[]
}

export function GrievanceTimelineRealtime({ grievanceId, initialTimeline }: Props) {
    const { timeline: realtimeTimeline } = useRealtimeGrievance(grievanceId)
    const [entries, setEntries] = useState<TimelineEntry[]>(initialTimeline)

    // Merge server-rendered entries with realtime updates (dedup by id)
    useEffect(() => {
        if (realtimeTimeline.length === 0) return
        setEntries(prev => {
            const ids = new Set(prev.map(e => e.id))
            const newEntries = realtimeTimeline.filter(e => !ids.has(e.id))
            return newEntries.length > 0 ? [...prev, ...newEntries] : prev
        })
    }, [realtimeTimeline])

    if (entries.length === 0) {
        return <p className="text-sm text-muted-foreground">No timeline entries yet.</p>
    }

    return (
        <div className="relative space-y-4 before:absolute before:left-4.75 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
            {entries.map((entry) => (
                <div key={entry.id} className="flex gap-4 relative">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background">
                        {entry.actor_role === "citizen" ? (
                            <User className="h-4 w-4 text-primary" />
                        ) : entry.actor_role === "admin" || entry.actor_role === "super_admin" ? (
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                        ) : (
                            <Bot className="h-4 w-4 text-muted-foreground" />
                        )}
                    </div>
                    <div className="flex-1 pb-4">
                        <p className="text-sm font-medium">{entry.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {formatDateTime(entry.created_at)}
                            {entry.actor_role && ` · ${entry.actor_role}`}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
