import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/actions/profiles"
import { ProfileForm } from "@/components/profile/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShieldCheck, User } from "lucide-react"
import type { Profile } from "@/lib/supabase/types"

export const metadata: Metadata = { title: "My Profile" }

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data: profile, error } = await getProfile()
    if (error || !profile) redirect("/login")

    const initials = (profile as Profile).full_name
        ?.split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() ?? "?"

    const p = profile as Profile

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your personal details and preferences
                </p>
            </div>

            {/* Identity Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 text-lg font-bold">
                            <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-lg font-semibold">{p.full_name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="mt-1.5 flex items-center gap-2">
                                <Badge variant="secondary" className="gap-1 text-xs capitalize">
                                    {p.role === "admin" || p.role === "super_admin" ? (
                                        <ShieldCheck className="h-3 w-3" />
                                    ) : (
                                        <User className="h-3 w-3" />
                                    )}
                                    {p.role.replace("_", " ")}
                                </Badge>
                                {p.vehicle_number && (
                                    <Badge variant="outline" className="text-xs font-mono">
                                        {p.vehicle_number}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Edit Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Edit Details</CardTitle>
                    <CardDescription>
                        Keep your vehicle number and DL number updated so challans are matched correctly.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileForm profile={p} />
                </CardContent>
            </Card>
        </div>
    )
}
