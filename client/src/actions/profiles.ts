'use server'

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { z } from "zod"

const updateProfileSchema = z.object({
    full_name: z.string().min(2, "Full name must be at least 2 characters"),
    phone: z.string().regex(/^(\+91)?[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
    permanent_address: z.string().optional(),
    vehicle_number: z.string().regex(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/, "Enter vehicle number like GJ01UV9043").optional().or(z.literal("")),
    dl_number: z.string().optional(),
    preferred_language: z.enum(["en", "hi", "gu"]).default("en"),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export async function getProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { data: rows, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .limit(1)

    if (error) return { error: error.message }
    return { data: rows?.[0] ?? null }
}

export async function updateProfile(input: UpdateProfileInput) {
    const parsed = updateProfileSchema.safeParse(input)
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { full_name, phone, permanent_address, vehicle_number, dl_number, preferred_language } = parsed.data

    const cleanVehicle = vehicle_number?.toUpperCase().replace(/\s+/g, "") || null
    const cleanDL = dl_number?.trim() || null
    const cleanAddress = permanent_address?.trim() || null

    const { error } = await supabase
        .from("profiles")
        .update({
            full_name,
            phone,
            permanent_address: cleanAddress,
            vehicle_number: cleanVehicle,
            dl_number: cleanDL,
            preferred_language,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

    if (error) return { error: error.message }

    revalidatePath("/profile")
    revalidatePath("/home")
    return { data: true }
}
