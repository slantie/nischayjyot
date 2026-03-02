'use client'

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    Loader2,
    Mail,
    Lock,
    User,
    Phone,
    Car,
    CreditCard,
} from "lucide-react"

import { signUp } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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

        // Light client-side checks
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

        toast.success("Account created! Check your email to verify your account.")
        router.push("/login")
    }

    const field = (name: keyof FieldErrors) =>
        errors[name] ? <p className="text-xs text-destructive mt-1">{errors[name]}</p> : null

    return (
        <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Create your account</CardTitle>
                <CardDescription>
                    Register to lodge and track your ONOC challan grievances
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input id="full_name" name="full_name" placeholder="Raj Kumar Patel" className="pl-9" disabled={isPending} />
                        </div>
                        {field("full_name")}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Mobile Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input id="phone" name="phone" type="tel" placeholder="9876543210" className="pl-9" disabled={isPending} />
                        </div>
                        {field("phone")}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input id="email" name="email" type="email" placeholder="you@example.com" className="pl-9" disabled={isPending} autoComplete="email" />
                        </div>
                        {field("email")}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input id="password" name="password" type="password" placeholder="Min. 8 characters" className="pl-9" disabled={isPending} autoComplete="new-password" />
                        </div>
                        {field("password")}
                    </div>

                    {/* Vehicle Number */}
                    <div className="space-y-2">
                        <Label htmlFor="vehicle_number">
                            Vehicle Number{" "}
                            <Badge variant="outline" className="ml-1 text-xs font-normal">Optional</Badge>
                        </Label>
                        <div className="relative">
                            <Car className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input id="vehicle_number" name="vehicle_number" placeholder="GJ01UV9043" className="pl-9 uppercase" disabled={isPending} />
                        </div>
                        {field("vehicle_number")}
                    </div>

                    {/* DL Number */}
                    <div className="space-y-2">
                        <Label htmlFor="dl_number">
                            Driving License No.{" "}
                            <Badge variant="outline" className="ml-1 text-xs font-normal">Optional</Badge>
                        </Label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input id="dl_number" name="dl_number" placeholder="GJ01 20XXXXXXXX" className="pl-9" disabled={isPending} />
                        </div>
                        {field("dl_number")}
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account…</>
                        ) : (
                            "Create Account"
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center text-sm text-muted-foreground">
                <p>
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
                </p>
            </CardFooter>
        </Card>
    )
}
