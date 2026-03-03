import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function GET() {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect("/login")

    const admin = createAdminClient()
    const { data: profileRows } = await admin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .limit(1)

    const profile = profileRows?.[0]
    if (!profile || !["admin", "super_admin"].includes(profile.role)) {
        return new Response("Forbidden", { status: 403 })
    }

    // Fetch all grievances with citizen info
    const { data, error } = await admin
        .from("grievances")
        .select(`
            ticket_number,
            category,
            status,
            priority,
            description,
            challan_number,
            lodged_via,
            resolution_notes,
            created_at,
            resolved_at,
            profiles!citizen_id(full_name, phone)
        `)
        .order("created_at", { ascending: false })
        .limit(5000)

    if (error) {
        return new Response("Failed to fetch data", { status: 500 })
    }

    // Build CSV
    const headers = [
        "Ticket #",
        "Citizen Name",
        "Phone",
        "Category",
        "Priority",
        "Status",
        "Challan Number",
        "Lodged Via",
        "Description",
        "Resolution Notes",
        "Created At",
        "Resolved At",
    ]

    function escapeCSV(val: unknown): string {
        const str = val == null ? "" : String(val)
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`
        }
        return str
    }

    type GrievanceExportRow = {
        ticket_number: number
        category: string
        status: string
        priority: string
        description: string
        challan_number: string | null
        lodged_via: string
        resolution_notes: string | null
        created_at: string
        resolved_at: string | null
        profiles: { full_name: string; phone: string } | null
    }

    const rows = (data as unknown as GrievanceExportRow[]).map((g) => [
        escapeCSV(g.ticket_number),
        escapeCSV(g.profiles?.full_name ?? ""),
        escapeCSV(g.profiles?.phone ?? ""),
        escapeCSV(g.category.replace(/_/g, " ")),
        escapeCSV(g.priority),
        escapeCSV(g.status.replace(/_/g, " ")),
        escapeCSV(g.challan_number ?? ""),
        escapeCSV(g.lodged_via),
        escapeCSV(g.description),
        escapeCSV(g.resolution_notes ?? ""),
        escapeCSV(new Date(g.created_at).toLocaleDateString("en-IN")),
        escapeCSV(g.resolved_at ? new Date(g.resolved_at).toLocaleDateString("en-IN") : ""),
    ].join(","))

    const csv = [headers.map(escapeCSV).join(","), ...rows].join("\r\n")
    const filename = `grievances-${new Date().toISOString().split("T")[0]}.csv`

    return new Response(csv, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    })
}
