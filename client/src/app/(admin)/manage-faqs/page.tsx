import type { Metadata } from "next"
import { createAdminClient } from "@/lib/supabase/admin"
import { FAQAdminList } from "@/components/faq/faq-crud"
import type { FAQ } from "@/lib/supabase/types"

export const metadata: Metadata = { title: "Manage FAQs" }

export default async function ManageFAQsPage() {
    const admin = createAdminClient()
    const { data } = await admin
        .from("faqs")
        .select("*")
        .order("language", { ascending: true })
        .order("display_order", { ascending: true })

    const faqs = (data ?? []) as FAQ[]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Manage FAQs</h1>
                <p className="mt-1 text-sm text-muted-foreground">{faqs.length} FAQs across all languages</p>
            </div>

            <FAQAdminList faqs={faqs} />
        </div>
    )
}
