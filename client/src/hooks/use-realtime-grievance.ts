"use client"

import { useEffect, useState, useCallback } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { Database, GrievanceTimeline, GrievanceStatus } from "@/lib/supabase/types"

type RealtimeTimelineEntry = Pick<GrievanceTimeline, "id" | "action" | "actor_role" | "created_at">

export function useRealtimeGrievance(grievanceId: string | null) {
    const [timeline, setTimeline] = useState<RealtimeTimelineEntry[]>([])
    const [status, setStatus] = useState<GrievanceStatus | null>(null)

    const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const fetchTimeline = useCallback(async () => {
        if (!grievanceId) return
        const { data } = await supabase
            .from("grievance_timeline")
            .select("id, action, actor_role, created_at")
            .eq("grievance_id", grievanceId)
            .order("created_at", { ascending: true })
        if (data) setTimeline(data as RealtimeTimelineEntry[])
    }, [grievanceId, supabase])

    useEffect(() => {
        if (!grievanceId) return

        fetchTimeline()

        // Subscribe to new timeline entries for this grievance
        const channel = supabase
            .channel(`grievance-timeline:${grievanceId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "grievance_timeline",
                    filter: `grievance_id=eq.${grievanceId}`,
                },
                (payload) => {
                    const entry = payload.new as RealtimeTimelineEntry
                    setTimeline(prev => [...prev, entry])
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "grievances",
                    filter: `id=eq.${grievanceId}`,
                },
                (payload) => {
                    const updated = payload.new as { status: GrievanceStatus }
                    if (updated.status) setStatus(updated.status)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [grievanceId, fetchTimeline, supabase])

    return { timeline, status }
}
