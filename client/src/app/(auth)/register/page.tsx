'use client'

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Mail, Lock, User, Phone, Car, CreditCard, ArrowRight } from "lucide-react"

import { signUp } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type FieldErrors = Partial<
    Record<"full_name" | "phone" | "email" | "password" | "vehicle_number" | "dl_number", string>
>

export default function RegisterPage() {
    const [isPending, setIsPending] = useState(false)
    const [errors, setErrors] = useState<FieldErrors>({})
    const router = useRouter()

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)

        const values = {
            full_name: (fd.get("full_name") as string).trim(),
            phone: (fd.get("phone") as string).trim(),
            email: (fd.get("email") as string).trim(),
            password: fd.get("password") as string,
            vehicle_number: (fd.get("vehicle_number") as string).trim().toUpperCase() || "",
            dl_number: (fd.get("dl_number") as string).trim() || "",
        }

        const e2: FieldErrors = {}
        if (values.full_name.length < 2) e2.full_name = "Name must be at least 2 characters"
        if (!values.phone.match(/^(\+91)?[6-9]\d{9}$/)) e2.phone = "Enter a valid 10-digit Indian mobile number"
        if (!values.email.includes("@")) e2.email = "Enter a valid email address"
        if (values.password.length < 8) e2.password = "Password must be at least 8 characters"
        if (values.vehicle_number && !values.vehicle_number.match(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/)) {
            e2.vehicle_number = "Invalid format — e.g. GJ01UV9043"
        }
        if (Object.keys(e2).length) {
            setErrors(e2)
            return
        }
        setErrors({})

        setIsPending(true)
        const result = await signUp(values)
        setIsPending(false)

        if (result.error) {
            toast.error(result.error)
            return
        }

        toast.success("Account created! You can now sign in.")
        router.push("/login")
    }

    const fieldError = (name: keyof FieldErrors) =>
        errors[name] ? <p className="text-xs text-destructive mt-1">{errors[name]}</p> : null

    return (
        <div className="w-full max-w-sm">
            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                    Register to lodge and track your ONOC challan grievances
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                    <Label htmlFor="full_name" className="text-sm font-medium">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="full_name" name="full_name" placeholder="Raj Kumar Patel" className="pl-9 h-10" disabled={isPending} />
                    </div>
                    {fieldError("full_name")}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-medium">Mobile Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="phone" name="phone" type="tel" placeholder="9876543210" className="pl-9 h-10" disabled={isPending} />
                    </div>
                    {fieldError("phone")}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="email" name="email" type="email" placeholder="you@example.com" className="pl-9 h-10" disabled={isPending} autoComplete="email" />
                    </div>
                    {fieldError("email")}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="password" name="password" type="password" placeholder="Min. 8 characters" className="pl-9 h-10" disabled={isPending} autoComplete="new-password" />
                    </div>
                    {fieldError("password")}
                </div>

                {/* Vehicle Number */}
                <div className="space-y-1.5">
                    <Label htmlFor="vehicle_number" className="flex items-center gap-1.5 text-sm font-medium">
                        Vehicle Number
                        <Badge variant="outline" className="h-4 px-1.5 text-[10px] font-normal">Optional</Badge>
                    </Label>
                    <div className="relative">
                        <Car className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="vehicle_number" name="vehicle_number" placeholder="GJ01UV9043" className="pl-9 h-10 uppercase" disabled={isPending} />
                    </div>
                    {fieldError("vehicle_number")}
                </div>

                {/* DL Number */}
                <div className="space-y-1.5">
                    <Label htmlFor="dl_number" className="flex items-center gap-1.5 text-sm font-medium">
                        Driving License No.
                        <Badge variant="outline" className="h-4 px-1.5 text-[10px] font-normal">Optional</Badge>
                    </Label>
                    <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="dl_number" name="dl_number" placeholder="GJ01 20XXXXXXXX" className="pl-9 h-10" disabled={isPending} />
                    </div>
                    {fieldError("dl_number")}
                </div>

                <Button type="submit" className="w-full h-10 gap-2 font-semibold" disabled={isPending}>
                    {isPending ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
                    ) : (
                        <>Create Account <ArrowRight className="h-4 w-4" /></>
                    )}
                </Button>
            </form>

            <div className="mt-6 border-t pt-5 text-center">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    )
}
