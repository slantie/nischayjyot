'use server'

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createGrievanceSchema, updateGrievanceStatusSchema, updateGrievancePrioritySchema } from "@/lib/validators"
import type { CreateGrievanceInput, UpdateGrievanceStatusInput } from "@/lib/validators"
import { grievanceLogger } from "@/lib/logger"

export async function createGrievance(input: CreateGrievanceInput) {
    const parsed = createGrievanceSchema.safeParse(input)
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { challan_id, challan_number, category, description, lodged_via, evidence_urls } = parsed.data
    grievanceLogger.info("createGrievance", { category, lodged_via })

    // .limit(1) then [0] — avoids .single() PostgREST coercion issue with proxy
    const { data: rows, error } = await supabase
        .from("grievances")
        .insert({
            citizen_id: user.id,
            challan_id: challan_id || null,
            challan_number: challan_number || null,
            category,
            description,
            lodged_via: lodged_via ?? "web",
            ...(evidence_urls && evidence_urls.length > 0 ? { evidence_urls } : {}),
        })
        .select("id, ticket_number")

    if (error) {
        grievanceLogger.error("createGrievance → insert failed", { error: error.message })
        return { error: error.message }
    }

    const data = rows?.[0]
    if (!data) return { error: "Grievance creation failed" }

    grievanceLogger.info("createGrievance → created", { ticket_number: data.ticket_number })

    await supabase.from("grievance_timeline").insert({
        grievance_id: data.id,
        action: "Grievance lodged",
        actor_id: user.id,
        actor_role: "citizen",
        details: { lodged_via },
    })

    await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Grievance Received",
        body: `Your grievance #${data.ticket_number} has been submitted and is under review.`,
        type: "grievance_update",
        reference_id: data.id,
        reference_type: "grievance",
    })

    revalidatePath("/track-grievance")
    return { data }
}

export async function getGrievances(page = 1, pageSize = 10) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
        .from("grievances")
        .select("*, challans(challan_number, violation_type, fine_amount, city)", { count: "exact" })
        .eq("citizen_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to)

    if (error) return { error: error.message }
    return { data, count }
}

export async function getGrievanceById(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // Use .limit(1)[0] instead of .single() to avoid proxy coercion errors
    const { data: rows, error } = await supabase
        .from("grievances")
        .select(`*, challans(*), grievance_timeline(*)`)
        .eq("id", id)
        .limit(1)

    if (error) return { error: error.message }
    const data = rows?.[0] ?? null
    return { data }
}

export async function getAllGrievances(page = 1, pageSize = 10, status?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = supabase
        .from("grievances")
        .select(
            `*, profiles!citizen_id(full_name, phone), challans(challan_number, violation_type, city)`,
            { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to)

    if (status) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query = query.eq("status", status as any)
    }

    const { data, error, count } = await query
    if (error) return { error: error.message }
    return { data, count }
}

export async function updateGrievanceStatus(input: UpdateGrievanceStatusInput) {
    const parsed = updateGrievanceStatusSchema.safeParse(input)
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // Verify admin role — .limit(1) not .single()
    const { data: profileRows } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .limit(1)

    const profile = profileRows?.[0]
    if (!profile || !["admin", "super_admin"].includes(profile.role)) {
        return { error: "Forbidden" }
    }

    const { grievance_id, status, resolution_notes } = parsed.data
    grievanceLogger.info("updateGrievanceStatus", { grievance_id, status })

    const resolved_at =
        status === "resolved" || status === "rejected"
            ? new Date().toISOString()
            : undefined

    const { data: updatedRows, error } = await supabase
        .from("grievances")
        .update({
            status,
            assigned_admin_id: user.id,
            updated_at: new Date().toISOString(),
            ...(resolution_notes ? { resolution_notes } : {}),
            ...(resolved_at ? { resolved_at } : {}),
        })
        .eq("id", grievance_id)
        .select("ticket_number, citizen_id")

    if (error) {
        grievanceLogger.error("updateGrievanceStatus → update failed", { error: error.message })
        return { error: error.message }
    }

    const data = updatedRows?.[0]
    if (!data) return { error: "Grievance not found" }

    await supabase.from("grievance_timeline").insert({
        grievance_id,
        action: `Status updated to ${status.replace(/_/g, " ")}`,
        actor_id: user.id,
        actor_role: profile.role,
        details: { resolution_notes: resolution_notes ?? null },
    })

    const statusLabel = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    await supabase.from("notifications").insert({
        user_id: data.citizen_id,
        title: `Grievance #${data.ticket_number} ${statusLabel}`,
        body: resolution_notes
            ? `Your grievance has been ${status}: ${resolution_notes}`
            : `Your grievance status has been updated to ${statusLabel}.`,
        type: "grievance_update",
        reference_id: grievance_id,
        reference_type: "grievance",
    })

    revalidatePath("/manage-grievances")
    revalidatePath(`/track-grievance/${grievance_id}`)
    return { data }
}

export async function updateGrievancePriority(grievanceId: string, priority: string) {
    const parsed = updateGrievancePrioritySchema.safeParse({ grievance_id: grievanceId, priority })
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { data: profileRows } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .limit(1)

    const profile = profileRows?.[0]
    if (!profile || !["admin", "super_admin"].includes(profile.role)) {
        return { error: "Forbidden" }
    }

    const { error } = await supabase
        .from("grievances")
        .update({ priority: parsed.data.priority, updated_at: new Date().toISOString() })
        .eq("id", grievanceId)

    if (error) return { error: error.message }

    await supabase.from("grievance_timeline").insert({
        grievance_id: grievanceId,
        action: `Priority set to ${parsed.data.priority}`,
        actor_id: user.id,
        actor_role: profile.role,
    })

    revalidatePath(`/manage-grievances/${grievanceId}`)
    revalidatePath("/manage-grievances")
    return { data: null }
}
