import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    color?: string
    bg?: string
    trend?: { value: number; label: string }
    className?: string
}

export function StatCard({
    title,
    value,
    icon: Icon,
    description,
    color = "text-primary",
    bg = "bg-primary/10",
    trend,
    className,
}: StatCardProps) {
    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
                        <p className="text-3xl font-bold mt-1 tracking-tight">{value}</p>
                        {description && (
                            <p className="text-xs text-muted-foreground mt-1">{description}</p>
                        )}
                        {trend && (
                            <p className={cn("text-xs mt-1 font-medium", trend.value >= 0 ? "text-green-600" : "text-red-600")}>
                                {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
                            </p>
                        )}
                    </div>
                    <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", bg)}>
                        <Icon className={cn("h-6 w-6", color)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
