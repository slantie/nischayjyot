import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmptyStateProps {
    icon?: LucideIcon
    title: string
    description?: string
    action?: {
        label: string
        href?: string
        onClick?: () => void
        icon?: LucideIcon
    }
    className?: string
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center",
            className
        )}>
            {Icon && (
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-8 w-8 text-muted-foreground/50" />
                </div>
            )}
            <h3 className="text-base font-semibold">{title}</h3>
            {description && (
                <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">{description}</p>
            )}
            {action && (
                <div className="mt-5">
                    {action.href ? (
                        <Button asChild className="gap-2">
                            <Link href={action.href}>
                                {action.icon && <action.icon className="h-4 w-4" />}
                                {action.label}
                            </Link>
                        </Button>
                    ) : (
                        <Button onClick={action.onClick} className="gap-2">
                            {action.icon && <action.icon className="h-4 w-4" />}
                            {action.label}
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
