'use client'

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Loader2, Mail, Lock } from "lucide-react"

import { signIn } from "@/actions/auth"
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

export default function LoginPage() {
    const [isPending, setIsPending] = useState(false)
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget
        const fd = new FormData(form)

        const email = (fd.get("email") as string).trim()
        const password = fd.get("password") as string

        // Simple client-side gate — server action validates fully
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
            // Success: signIn redirects server-side
        } catch {
            // redirect() throws — expected
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>Sign in to your NishchayJyot account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                className="pl-9"
                                disabled={isPending}
                                autoComplete="email"
                            />
                        </div>
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
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
                                className="pl-9"
                                disabled={isPending}
                                autoComplete="current-password"
                            />
                        </div>
                        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in…
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-center text-sm text-muted-foreground">
                <p>
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-medium text-primary hover:underline">
                        Register here
                    </Link>
                </p>
                <p className="text-xs">
                    For admin access, contact your NIC or Police Department administrator.
                </p>
            </CardFooter>
        </Card>
    )
}
