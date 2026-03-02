'use server'

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { z } from "zod"
import type { FAQ } from "@/lib/supabase/types"

const createFAQSchema = z.object({
    question: z.string().min(5, "Question must be at least 5 characters"),
    answer: z.string().min(10, "Answer must be at least 10 characters"),
    category: z.string().default("general"),
    language: z.enum(["en", "hi", "gu"]).default("en"),
    display_order: z.number().int().default(0),
    is_published: z.boolean().default(true),
})

export type CreateFAQInput = z.infer<typeof createFAQSchema>
export type UpdateFAQInput = Partial<CreateFAQInput>

async function assertAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" as const, user: null }

    const admin = createAdminClient()
    const { data: rows } = await admin.from("profiles").select("role").eq("id", user.id).limit(1)
    const role = rows?.[0]?.role
    if (!role || !["admin", "super_admin"].includes(role)) {
        return { error: "Forbidden" as const, user: null }
    }
    return { error: null, user }
}

export async function getFAQs(language = "en") {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_published", true)
        .eq("language", language)
        .order("display_order", { ascending: true })

    if (error) return { error: error.message }
    return { data: (data ?? []) as FAQ[] }
}

export async function getAllFAQsAdmin() {
    const { error: authError } = await assertAdmin()
    if (authError) return { error: authError }

    const admin = createAdminClient()
    const { data, error } = await admin
        .from("faqs")
        .select("*")
        .order("language", { ascending: true })
        .order("display_order", { ascending: true })

    if (error) return { error: error.message }
    return { data: (data ?? []) as FAQ[] }
}

export async function createFAQ(input: CreateFAQInput) {
    const parsed = createFAQSchema.safeParse(input)
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const { error: authError } = await assertAdmin()
    if (authError) return { error: authError }

    const admin = createAdminClient()
    const { data, error } = await admin.from("faqs").insert(parsed.data).select("id")

    if (error) return { error: error.message }
    revalidatePath("/manage-faqs")
    revalidatePath("/faq")
    return { data: data?.[0] }
}

export async function updateFAQ(id: string, input: UpdateFAQInput) {
    const { error: authError } = await assertAdmin()
    if (authError) return { error: authError }

    const admin = createAdminClient()
    const { error } = await admin
        .from("faqs")
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq("id", id)

    if (error) return { error: error.message }
    revalidatePath("/manage-faqs")
    revalidatePath("/faq")
    return { data: true }
}

export async function deleteFAQ(id: string) {
    const { error: authError } = await assertAdmin()
    if (authError) return { error: authError }

    const admin = createAdminClient()
    const { error } = await admin.from("faqs").delete().eq("id", id)

    if (error) return { error: error.message }
    revalidatePath("/manage-faqs")
    revalidatePath("/faq")
    return { data: true }
}

export async function toggleFAQPublished(id: string, is_published: boolean) {
    return updateFAQ(id, { is_published })
}
