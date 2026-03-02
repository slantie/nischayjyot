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
import { Plus, FileText, Bot } from "lucide-react"
import type { Grievance } from "@/lib/supabase/types"

export const metadata: Metadata = { title: "My Grievances" }

type GrievanceRow = Pick<
    Grievance,
    "id" | "ticket_number" | "status" | "category" | "description" | "created_at" | "challan_number"
>

export default async function TrackGrievancePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data, error } = await getGrievances(1, 50)
    const grievances = (data ?? []) as unknown as GrievanceRow[]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Grievances</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Track all your submitted challan grievances</p>
                </div>
                <Button asChild className="gap-2">
                    <Link href="/chatbot">
                        <Bot className="h-4 w-4" /> New via AI
                    </Link>
                </Button>
            </div>

            {error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                    Failed to load grievances: {error}
                </div>
            ) : grievances.length === 0 ? (
                <div className="rounded-xl border border-dashed p-12 text-center">
                    <FileText className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                    <p className="font-medium">No grievances yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Start by using the AI chatbot to lodge your first grievance.
                    </p>
                    <Button className="mt-4 gap-2" asChild>
                        <Link href="/chatbot">
                            <Bot className="h-4 w-4" /> Use AI Chatbot
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {grievances.map((g) => (
                        <Link key={g.id} href={`/track-grievance/${g.id}`}>
                            <Card className="transition-shadow hover:shadow-md cursor-pointer">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-semibold">Ticket #{g.ticket_number}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {GRIEVANCE_CATEGORY_LABELS[g.category]}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{g.description}</p>
                                            {g.challan_number && (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Challan: <span className="font-mono">{g.challan_number}</span>
                                                </p>
                                            )}
                                        </div>
                                        <div className="shrink-0 text-right space-y-1.5">
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${GRIEVANCE_STATUS_COLORS[g.status]}`}>
                                                {GRIEVANCE_STATUS_LABELS[g.status]}
                                            </span>
                                            <p className="text-xs text-muted-foreground">{formatDate(g.created_at)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
