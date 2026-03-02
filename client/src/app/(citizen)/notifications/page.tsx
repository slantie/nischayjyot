import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getNotifications, markAllAsRead } from "@/actions/notifications"
import { timeAgo } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bell, BellOff, Check } from "lucide-react"
import type { Notification } from "@/lib/supabase/types"

export const metadata: Metadata = { title: "Notifications" }

async function handleMarkAll() {
    "use server"
    await markAllAsRead()
}

export default async function NotificationsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data } = await getNotifications()
    const notifications = (data ?? []) as Notification[]
    const unread = notifications.filter((n) => !n.is_read).length

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {unread > 0 ? `${unread} unread notification${unread > 1 ? "s" : ""}` : "All caught up!"}
                    </p>
                </div>
                {unread > 0 && (
                    <form action={handleMarkAll}>
                        <Button variant="outline" size="sm" type="submit" className="gap-2">
                            <Check className="h-4 w-4" /> Mark all read
                        </Button>
                    </form>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="rounded-xl border border-dashed p-12 text-center">
                    <BellOff className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                    <p className="font-medium">No notifications yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        You'll be notified here when your grievance status changes.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${!n.is_read ? "border-primary/20 bg-primary/5" : "bg-card"
                                }`}
                        >
                            <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${!n.is_read ? "bg-primary/10" : "bg-muted"
                                }`}>
                                <Bell className={`h-4 w-4 ${!n.is_read ? "text-primary" : "text-muted-foreground"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className={`text-sm font-medium ${!n.is_read ? "" : "text-muted-foreground"}`}>
                                        {n.title}
                                    </p>
                                    {!n.is_read && (
                                        <Badge variant="default" className="h-4 px-1.5 text-[10px]">New</Badge>
                                    )}
                                </div>
                                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{n.body}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{timeAgo(n.created_at)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
