import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GrievanceStatusBadge } from "@/components/grievance/status-badge"
import { GRIEVANCE_CATEGORY_LABELS } from "@/lib/constants"
import { formatDate } from "@/lib/utils"
import type { GrievanceStatus, GrievanceCategory } from "@/lib/supabase/types"
import { Bot, Globe, MessageCircle } from "lucide-react"

interface GrievanceCardProps {
    id: string
    ticket_number: number
    status: GrievanceStatus
    category: GrievanceCategory
    description: string
    created_at: string
    challan_number?: string | null
    lodged_via?: string
    href?: string
    className?: string
}

const LODGING_ICONS = {
    chatbot: Bot,
    web: Globe,
    api: MessageCircle,
}

export function GrievanceCard({
    id,
    ticket_number,
    status,
    category,
    description,
    created_at,
    challan_number,
    lodged_via,
    href,
    className,
}: GrievanceCardProps) {
    const content = (
        <Card className={cn("transition-all hover:shadow-md hover:border-primary/30", className)}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-sm font-semibold">Ticket #{ticket_number}</span>
                            <Badge variant="outline" className="text-xs">
                                {GRIEVANCE_CATEGORY_LABELS[category]}
                            </Badge>
                            {lodged_via && lodged_via !== "web" && (() => {
                                const Icon = LODGING_ICONS[lodged_via as keyof typeof LODGING_ICONS] ?? Globe
                                return (
                                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                        <Icon className="h-3 w-3" />
                                        {lodged_via}
                                    </span>
                                )
                            })()}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {description}
                        </p>
                        {challan_number && (
                            <p className="mt-1.5 text-xs text-muted-foreground">
                                Challan:{" "}
                                <span className="font-mono text-foreground/70">{challan_number}</span>
                            </p>
                        )}
                    </div>
                    <div className="shrink-0 text-right space-y-1.5">
                        <GrievanceStatusBadge status={status} />
                        <p className="text-xs text-muted-foreground">{formatDate(created_at)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    if (href) {
        return (
            <Link href={href} className="block">
                {content}
            </Link>
        )
    }
    return content
}
