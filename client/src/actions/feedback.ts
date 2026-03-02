'use server'

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { z } from "zod"
import type { Feedback } from "@/lib/supabase/types"
import { revalidatePath } from "next/cache"

const submitFeedbackSchema = z.object({
    satisfaction_rating: z.number().int().min(1).max(5),
    difficulties_faced: z.string().optional(),
    suggestions: z.string().optional(),
    grievance_id: z.string().uuid().optional(),
})

export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>

export async function submitFeedback(input: SubmitFeedbackInput) {
    const parsed = submitFeedbackSchema.safeParse(input)
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { satisfaction_rating, difficulties_faced, suggestions, grievance_id } = parsed.data

    // Use admin client to bypass RLS (feedback table needs citizen_id = auth.uid())
    const admin = createAdminClient()
    const { data, error } = await admin.from("feedback").insert({
        citizen_id: user.id,
        satisfaction_rating,
        difficulties_faced: difficulties_faced?.trim() || null,
        suggestions: suggestions?.trim() || null,
        grievance_id: grievance_id || null,
    }).select("id")

    if (error) return { error: error.message }
    return { data: data?.[0] }
}

export async function getFeedbackForAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const admin = createAdminClient()

    // Check admin role
    const { data: profileRows } = await admin.from("profiles").select("role").eq("id", user.id).limit(1)
    const role = profileRows?.[0]?.role
    if (!role || !["admin", "super_admin"].includes(role)) return { error: "Forbidden" }

    const { data, error } = await admin
        .from("feedback")
        .select(`
      id, satisfaction_rating, difficulties_faced, suggestions, created_at,
      profiles!citizen_id(full_name, phone),
      grievances(ticket_number)
    `)
        .order("created_at", { ascending: false })

    if (error) return { error: error.message }
    return { data: data ?? [] }
}
