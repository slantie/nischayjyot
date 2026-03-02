import { cn } from "@/lib/utils"
import type { GrievanceStatus, PriorityLevel } from "@/lib/supabase/types"
import { GRIEVANCE_STATUS_LABELS, PRIORITY_LABELS } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"

const STATUS_VARIANTS: Record<GrievanceStatus, string> = {
    open: "border-blue-300   bg-blue-50   text-blue-700   dark:bg-blue-950/40 dark:text-blue-300",
    in_progress: "border-yellow-300 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300",
    under_review: "border-purple-300 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
    resolved: "border-green-300  bg-green-50  text-green-700  dark:bg-green-950/40 dark:text-green-300",
    rejected: "border-red-300    bg-red-50    text-red-700    dark:bg-red-950/40  dark:text-red-300",
    escalated: "border-orange-300 bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
}

const PRIORITY_VARIANTS: Record<PriorityLevel, string> = {
    low: "border-slate-300  bg-slate-50   text-slate-600",
    medium: "border-blue-200   bg-blue-50    text-blue-600",
    high: "border-orange-300 bg-orange-50  text-orange-700",
    urgent: "border-red-400    bg-red-50     text-red-700 font-semibold",
}

interface GrievanceStatusBadgeProps {
    status: GrievanceStatus
    className?: string
}

export function GrievanceStatusBadge({ status, className }: GrievanceStatusBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={cn("text-xs font-medium", STATUS_VARIANTS[status], className)}
        >
            {GRIEVANCE_STATUS_LABELS[status]}
        </Badge>
    )
}

interface PriorityBadgeProps {
    priority: PriorityLevel
    className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={cn("text-xs", PRIORITY_VARIANTS[priority], className)}
        >
            {PRIORITY_LABELS[priority]}
        </Badge>
    )
}
