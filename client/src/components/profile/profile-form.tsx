"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { updateProfile } from "@/actions/profiles"
import type { Profile } from "@/lib/supabase/types"
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Save, Loader2 } from "lucide-react"

type FieldErrors = Partial<Record<string, string>>

export function ProfileForm({ profile }: { profile: Profile }) {
    const [isPending, startTransition] = useTransition()
    const [errors, setErrors] = useState<FieldErrors>({})
    const [lang, setLang] = useState<string>(profile.preferred_language ?? "en")
    const router = useRouter()

    function validate(data: FormData): FieldErrors {
        const errs: FieldErrors = {}
        const name = (data.get("full_name") as string)?.trim()
        const phone = (data.get("phone") as string)?.trim()
        const vehicle = (data.get("vehicle_number") as string)?.trim().toUpperCase()

        if (!name || name.length < 2) errs.full_name = "Full name must be at least 2 characters"
        if (!phone || !/^(\+91)?[6-9]\d{9}$/.test(phone)) errs.phone = "Enter a valid 10-digit Indian mobile number"
        if (vehicle && !/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(vehicle)) {
            errs.vehicle_number = "Format: GJ01UV9043 (no spaces)"
        }
        return errs
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget
        const data = new FormData(form)
        const errs = validate(data)

        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }
        setErrors({})

        const vehicle = (data.get("vehicle_number") as string).trim().toUpperCase().replace(/\s+/g, "")

        startTransition(async () => {
            const result = await updateProfile({
                full_name: (data.get("full_name") as string).trim(),
                phone: (data.get("phone") as string).trim(),
                permanent_address: (data.get("permanent_address") as string)?.trim() || undefined,
                vehicle_number: vehicle || undefined,
                dl_number: (data.get("dl_number") as string)?.trim() || undefined,
                preferred_language: lang as "en" | "hi" | "gu",
            })

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Profile updated successfully!")
                router.refresh()
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
                <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input name="full_name" defaultValue={profile.full_name} placeholder="Rahul Sharma" />
                    </FormControl>
                    <FormMessage>{errors.full_name}</FormMessage>
                </FormItem>

                <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                        <Input name="phone" defaultValue={profile.phone} placeholder="9876543210" />
                    </FormControl>
                    <FormDescription>10-digit Indian mobile number</FormDescription>
                    <FormMessage>{errors.phone}</FormMessage>
                </FormItem>

                <FormItem>
                    <FormLabel>Vehicle Number</FormLabel>
                    <FormControl>
                        <Input
                            name="vehicle_number"
                            defaultValue={profile.vehicle_number ?? ""}
                            placeholder="GJ01UV9043"
                            className="uppercase"
                            onInput={(e) => {
                                const el = e.currentTarget
                                el.value = el.value.toUpperCase().replace(/\s+/g, "")
                            }}
                        />
                    </FormControl>
                    <FormDescription>Used to auto-match your challans</FormDescription>
                    <FormMessage>{errors.vehicle_number}</FormMessage>
                </FormItem>

                <FormItem>
                    <FormLabel>Driving License Number</FormLabel>
                    <FormControl>
                        <Input name="dl_number" defaultValue={profile.dl_number ?? ""} placeholder="GJ0120220012345" />
                    </FormControl>
                    <FormMessage>{errors.dl_number}</FormMessage>
                </FormItem>

                <FormItem className="sm:col-span-2">
                    <FormLabel>Preferred Language</FormLabel>
                    <Select value={lang} onValueChange={setLang}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                            <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                        </SelectContent>
                    </Select>
                </FormItem>
            </div>

            <FormItem>
                <FormLabel>Permanent Address</FormLabel>
                <FormControl>
                    <Textarea
                        name="permanent_address"
                        defaultValue={profile.permanent_address ?? ""}
                        placeholder="123, MG Road, Ahmedabad, Gujarat — 380001"
                        rows={3}
                    />
                </FormControl>
                <FormMessage>{errors.permanent_address}</FormMessage>
            </FormItem>

            <div className="flex justify-end">
                <Button type="submit" disabled={isPending} className="gap-2 min-w-36">
                    {isPending ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                    ) : (
                        <><Save className="h-4 w-4" /> Save changes</>
                    )}
                </Button>
            </div>
        </form>
    )
}
