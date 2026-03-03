'use client'

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { updateGrievanceStatus, updateGrievancePriority } from "@/actions/grievances"
import {
    GRIEVANCE_STATUS_LABELS,
    PRIORITY_LABELS,
    PRIORITY_COLORS,
} from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import type { GrievanceStatus, PriorityLevel } from "@/lib/supabase/types"

const PRIORITY_LEVELS: { value: PriorityLevel; label: string }[] = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
]

const STATUS_TRANSITIONS: { value: GrievanceStatus; label: string; variant: "default" | "outline" | "destructive" | "secondary" }[] = [
    { value: "in_progress", label: "Mark In Progress", variant: "secondary" },
    { value: "under_review", label: "Mark Under Review", variant: "outline" },
    { value: "resolved", label: "Mark Resolved ✓", variant: "default" },
    { value: "rejected", label: "Reject", variant: "destructive" },
    { value: "escalated", label: "Escalate", variant: "outline" },
]

export function GrievanceStatusUpdater({
    grievanceId,
    currentStatus,
    currentPriority,
}: {
    grievanceId: string
    currentStatus: GrievanceStatus
    currentPriority: PriorityLevel
}) {
    const [notes, setNotes] = useState("")
    const [isPending, startTransition] = useTransition()
    const [isPriorityPending, startPriorityTransition] = useTransition()
    const router = useRouter()

    function handlePriorityUpdate(priority: PriorityLevel) {
        startPriorityTransition(async () => {
            const result = await updateGrievancePriority(grievanceId, priority)
            if (result.error) {
                toast.error(result.error)
                return
            }
            toast.success(`Priority set to ${PRIORITY_LABELS[priority]}`)
            router.refresh()
        })
    }

    function handleUpdate(status: GrievanceStatus) {
        if ((status === "resolved" || status === "rejected") && !notes.trim()) {
            toast.error("Please add resolution notes before closing the grievance.")
            return
        }

        startTransition(async () => {
            const result = await updateGrievanceStatus({
                grievance_id: grievanceId,
                status,
                resolution_notes: notes.trim() || undefined,
            })

            if (result.error) {
                toast.error(result.error)
                return
            }

            toast.success(`Grievance marked as ${GRIEVANCE_STATUS_LABELS[status]}`)
            setNotes("")
            router.refresh()
        })
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="resolution-notes">
                    Resolution Notes
                    {["resolved", "rejected"].includes(currentStatus) ? "" : " (required for Resolve/Reject)"}
                </Label>
                <Textarea
                    id="resolution-notes"
                    placeholder="Describe the resolution, findings, or reason for rejection…"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isPending}
                />
            </div>
            <div className="flex flex-wrap gap-2">
                {STATUS_TRANSITIONS.filter((t) => t.value !== currentStatus).map((t) => (
                    <Button
                        key={t.value}
                        variant={t.variant}
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleUpdate(t.value)}
                    >
                        {isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                        {t.label}
                    </Button>
                ))}
            </div>

            <Separator className="my-2" />

            <div className="space-y-2">
                <Label>Change Priority</Label>
                <div className="flex flex-wrap gap-2">
                    {PRIORITY_LEVELS.map((p) => (
                        <Button
                            key={p.value}
                            variant={p.value === currentPriority ? "default" : "outline"}
                            size="sm"
                            disabled={isPriorityPending || p.value === currentPriority}
                            onClick={() => handlePriorityUpdate(p.value)}
                            className={p.value !== currentPriority ? PRIORITY_COLORS[p.value] : ""}
                        >
                            {isPriorityPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                            {p.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}
