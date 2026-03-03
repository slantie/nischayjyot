'use server'

import crypto from "node:crypto"
import { createClient } from "@/lib/supabase/server"

/**
 * Returns a Cloudinary signed-upload signature so the browser can upload
 * directly to Cloudinary without exposing the API secret.
 *
 * Required env vars:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */
export async function getCloudinarySignature() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" as const }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
        return { error: "Cloudinary not configured" as const }
    }

    const timestamp = Math.round(Date.now() / 1000)
    const folder = "nischayjyot_evidence"

    // Cloudinary signature: SHA-1 of alphabetically-sorted params + api_secret
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`
    const signature = crypto
        .createHash("sha1")
        .update(paramsToSign + apiSecret)
        .digest("hex")

    return {
        data: {
            cloudName,
            apiKey,
            timestamp,
            signature,
            folder,
            uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        },
    }
}
