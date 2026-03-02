'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { signUpSchema, signInSchema, type SignUpInput, type SignInInput } from "@/lib/validators"
import { authLogger } from "@/lib/logger"

export async function signUp(input: SignUpInput) {
    const parsed = signUpSchema.safeParse(input)
    if (!parsed.success) {
        const msg = parsed.error.issues[0].message
        authLogger.warn("signUp validation failed", { message: msg })
        return { error: msg }
    }

    const { full_name, phone, email, password, dl_number, vehicle_number } = parsed.data
    authLogger.info("signUp attempt", { email })

    const admin = createAdminClient()
    let userId: string

    try {
        // Use admin.createUser so the account is confirmed immediately — no email verification needed
        const { data, error } = await admin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name, phone },
        })

        if (error) {
            // Email already registered — update their password + re-confirm so they can log in
            if (error.message.toLowerCase().includes("already been registered") || error.status === 422) {
                authLogger.warn("signUp → email already exists, updating credentials", { email })
                const { data: listData } = await admin.auth.admin.listUsers()
                const existing = listData?.users?.find((u) => u.email === email)
                if (!existing) return { error: "An account with this email already exists. Please log in." }
                await admin.auth.admin.updateUserById(existing.id, {
                    password,
                    email_confirm: true,
                    user_metadata: { full_name, phone },
                })
                userId = existing.id
                authLogger.info("signUp → existing user credentials updated", { userId })
            } else {
                authLogger.error("signUp → admin.createUser failed", {
                    status: error.status,
                    message: error.message,
                })
                if (error.message.includes("ConnectTimeout") || error.message.includes("fetch failed")) {
                    return { error: "Cannot reach the server. Please check your connection and try again." }
                }
                return { error: error.message }
            }
        } else {
            userId = data.user.id
            authLogger.info("signUp → auth user created (confirmed)", { userId, email })
        }
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        authLogger.error("signUp → unexpected error", { message: msg })
        if (msg.includes("ConnectTimeout") || msg.includes("fetch failed")) {
            return { error: "Cannot reach the server. Please check your connection and try again." }
        }
        return { error: "An unexpected error occurred. Please try again." }
    }

    // Explicitly upsert the profile row — don't rely solely on the DB trigger
    try {
        const { error: upsertErr } = await admin
            .from("profiles")
            .upsert({
                id: userId,
                full_name,
                phone,
                role: "citizen",
                ...(vehicle_number ? { vehicle_number } : {}),
                ...(dl_number ? { dl_number } : {}),
            })
        if (upsertErr) {
            authLogger.warn("signUp → profile upsert failed", { error: upsertErr.message })
        } else {
            authLogger.debug("signUp → profile upserted", { userId })
        }
    } catch (err) {
        authLogger.warn("signUp → profile upsert threw", { err })
    }

    authLogger.info("signUp complete", { userId, email })
    return { data: { userId } }
}

export async function signIn(input: SignInInput) {
    const parsed = signInSchema.safeParse(input)
    if (!parsed.success) {
        const msg = parsed.error.issues[0].message
        authLogger.warn("signIn validation failed", { message: msg })
        return { error: msg }
    }

    const { email, password } = parsed.data
    authLogger.info("signIn attempt", { email })

    const supabase = await createClient()

    let authData, error
    try {
        ; ({ data: authData, error } = await supabase.auth.signInWithPassword({ email, password }))
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        authLogger.error("signIn → unexpected error", { message: msg })
        if (msg.includes("ConnectTimeout") || msg.includes("fetch failed")) {
            return { error: "Cannot reach the server. Please check your connection and try again." }
        }
        return { error: "An unexpected error occurred. Please try again." }
    }

    if (error) {
        // Log the REAL error so we can see it in the terminal
        authLogger.error("signIn → signInWithPassword failed", {
            code: error.code,
            status: error.status,
            message: error.message,
        })

        // Auto-confirm unconfirmed emails and retry sign-in once.
        // Supabase returns either "email_not_confirmed" or "invalid_credentials" for unconfirmed users
        // depending on the project version — handle both by checking if the user exists but is unconfirmed.
        const isEmailError =
            error.code === "email_not_confirmed" ||
            error.message.toLowerCase().includes("email not confirmed") ||
            error.code === "invalid_credentials"

        if (isEmailError) {
            authLogger.info("signIn → checking if email is unconfirmed", { email })
            try {
                const adminForConfirm = createAdminClient()
                const { data: listData } = await adminForConfirm.auth.admin.listUsers()
                const existingUser = listData?.users?.find((u) => u.email === email)
                if (existingUser && !existingUser.email_confirmed_at) {
                    await adminForConfirm.auth.admin.updateUserById(existingUser.id, { email_confirm: true })
                    authLogger.info("signIn → auto-confirmed existing user, retrying sign-in", { userId: existingUser.id })
                    ;({ data: authData, error } = await supabase.auth.signInWithPassword({ email, password }))
                }
            } catch (confirmErr) {
                authLogger.warn("signIn → auto-confirm failed", { confirmErr })
            }
        }

        // If error persists after auto-confirm attempt (or was a genuine wrong-password error)
        if (error) {
            if (error.message.toLowerCase().includes("invalid login") || error.code === "invalid_credentials") {
                return { error: "Invalid email or password." }
            }
            return { error: error.message }
        }
    }

    authLogger.info("signIn → authenticated", { userId: authData?.user?.id, email })

    if (!authData?.user) {
        return { error: "Sign in failed. Please try again." }
    }

    // Fetch role via admin client.
    // IMPORTANT: use .limit(1) NOT .single() — .single() uses a different PostgREST
    // endpoint that can fail with "Cannot coerce the result to a single JSON object"
    // through proxy setups. Array queries are plain REST and always reliable.
    const admin = createAdminClient()
    const { data: profiles, error: profileErr } = await admin
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .limit(1)

    if (profileErr) {
        authLogger.warn("signIn → profile query failed", { error: profileErr.message })
    }

    // If no profile row exists (user was created before trigger was deployed),
    // create one now so subsequent operations work correctly.
    if (!profileErr && (!profiles || profiles.length === 0)) {
        authLogger.warn("signIn → no profile row found, creating one", { userId: authData.user.id })
        await admin.from("profiles").insert({
            id: authData.user.id,
            full_name: authData.user.user_metadata?.full_name ?? "User",
            phone: authData.user.user_metadata?.phone ?? "",
            role: "citizen",
        })
    }

    const role = profiles?.[0]?.role ?? "citizen"
    authLogger.info("signIn → redirecting", { role, profileExists: (profiles?.length ?? 0) > 0 })

    revalidatePath("/", "layout")

    if (role === "admin" || role === "super_admin") {
        redirect("/dashboard")
    } else {
        redirect("/home")
    }
}

export async function signOut() {
    authLogger.info("signOut")
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath("/", "layout")
    redirect("/login")
}

export async function getUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}
