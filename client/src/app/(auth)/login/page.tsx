'use client'

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react"

import { signIn } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
    const [isPending, setIsPending] = useState(false)
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget
        const fd = new FormData(form)

        const email = (fd.get("email") as string).trim()
        const password = fd.get("password") as string

        const newErrors: typeof errors = {}
        if (!email || !email.includes("@")) newErrors.email = "Enter a valid email address"
        if (!password) newErrors.password = "Password is required"
        if (Object.keys(newErrors).length) {
            setErrors(newErrors)
            return
        }
        setErrors({})

        setIsPending(true)
        try {
            const result = await signIn({ email, password })
            if (result?.error) toast.error(result.error)
        } catch {
            // redirect() throws — expected
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="w-full max-w-sm">
            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                    Sign in to your NishchayJyot account
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-9 h-10"
                            disabled={isPending}
                            autoComplete="email"
                        />
                    </div>
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                        <Link
                            href="#"
                            className="text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-9 h-10"
                            disabled={isPending}
                            autoComplete="current-password"
                        />
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                <Button type="submit" className="w-full h-10 gap-2 font-semibold" disabled={isPending}>
                    {isPending ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
                    ) : (
                        <>Sign in <ArrowRight className="h-4 w-4" /></>
                    )}
                </Button>
            </form>

            <div className="mt-6 space-y-3 border-t pt-5 text-center">
                <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-semibold text-primary hover:underline">
                        Register here
                    </Link>
                </p>
                <p className="text-xs text-muted-foreground/60">
                    Admin access is managed by your project administrator.
                </p>
            </div>
        </div>
    )
}
