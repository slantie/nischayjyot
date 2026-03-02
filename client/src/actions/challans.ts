'use server'

import { createClient } from "@/lib/supabase/server"

export async function getChallansForUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // .limit(1) not .single() — avoids PostgREST coercion error with proxy
    const { data: profiles } = await supabase
        .from("profiles")
        .select("vehicle_number, dl_number")
        .eq("id", user.id)
        .limit(1)

    const profile = profiles?.[0]
    if (!profile) return { data: [] }

    const filters: string[] = []
    if (profile.vehicle_number) filters.push(`vehicle_number.eq.${profile.vehicle_number}`)
    if (profile.dl_number) filters.push(`dl_number.eq.${profile.dl_number}`)

    if (filters.length === 0) return { data: [] }

    const { data, error } = await supabase
        .from("challans")
        .select("*")
        .or(filters.join(","))
        .order("challan_date", { ascending: false })

    if (error) return { error: error.message }
    return { data }
}

export async function getChallanByNumber(challanNumber: string) {
    if (!challanNumber?.trim()) return { error: "Challan number is required" }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { data: rows, error } = await supabase
        .from("challans")
        .select("*")
        .eq("challan_number", challanNumber.trim())
        .limit(1)

    if (error || !rows?.length) return { error: "Challan not found" }
    return { data: rows[0] }
}

export async function getChallanById(id: string) {
    if (!id) return { error: "Challan ID is required" }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { data: rows, error } = await supabase
        .from("challans")
        .select("*")
        .eq("id", id)
        .limit(1)

    if (error) return { error: error.message }
    return { data: rows?.[0] }
}
