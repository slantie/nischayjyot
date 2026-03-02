import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

/**
 * Service-role admin client — bypasses RLS.
 * ONLY use server-side (Server Actions, Edge Functions, seeding scripts).
 * NEVER expose to browser or client components.
 */
export function createAdminClient() {
    return createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )
}
