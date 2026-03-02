"use client"

import { useEffect, useState, useCallback } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { toast } from "sonner"
import type { Database, Notification } from "@/lib/supabase/types"

export function useRealtimeNotifications(userId: string | null) {
    const [unreadCount, setUnreadCount] = useState(0)

    const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Fetch initial unread count
    const fetchUnread = useCallback(async () => {
        if (!userId) return
        const { count } = await supabase
            .from("notifications")
            .select("id", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("is_read", false)
        setUnreadCount(count ?? 0)
    }, [userId, supabase])

    useEffect(() => {
        if (!userId) return

        fetchUnread()

        // Subscribe to new notifications for this user
        const channel = supabase
            .channel(`notifications:${userId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    const notification = payload.new as Notification
                    setUnreadCount((prev) => prev + 1)
                    toast(notification.title, {
                        description: notification.body,
                        duration: 6000,
                    })
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "notifications",
                    filter: `user_id=eq.${userId}`,
                },
                () => {
                    // Re-fetch count when notifications are marked read
                    fetchUnread()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId, fetchUnread, supabase])

    return { unreadCount, setUnreadCount }
}
