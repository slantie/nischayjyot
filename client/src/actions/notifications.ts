'use server'

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function getNotifications(onlyUnread = false) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)

    if (onlyUnread) {
        query = query.eq("is_read", false)
    }

    const { data, error } = await query
    if (error) return { error: error.message }
    return { data }
}

export async function markAsRead(notificationId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .eq("user_id", user.id)

    if (error) return { error: error.message }
    revalidatePath("/notifications")
    return { data: true }
}

export async function markAllAsRead() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false)

    if (error) return { error: error.message }
    revalidatePath("/notifications")
    return { data: true }
}
