'use client'

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Loader2, ArrowLeft, Send, Bot, FileText, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createGrievance } from "@/actions/grievances"

const CATEGORIES = [
    { value: "false_challan", label: "False Challan", desc: "Challan issued for a violation you did not commit" },
    { value: "wrong_amount", label: "Wrong Amount", desc: "The fine amount is incorrect or does not match the violation" },
    { value: "wrong_vehicle", label: "Wrong Vehicle", desc: "Challan was issued against the wrong vehicle number" },
    { value: "duplicate_challan", label: "Duplicate Challan", desc: "Same violation has been challan'd multiple times" },
    { value: "payment_issue", label: "Payment Issue", desc: "Payment was made but challan still shows as unpaid" },
    { value: "other", label: "Other", desc: "Any other grievance related to an ONOC challan" },
] as const

type Category = typeof CATEGORIES[number]["value"]

export default function NewGrievancePage() {
    const router = useRouter()
    const [category, setCategory] = useState<Category | "">("")
    const [description, setDescription] = useState("")
    const [challanNumber, setChallanNumber] = useState("")
    const [isPending, setIsPending] = useState(false)

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        if (!category) {
            toast.error("Please select a grievance category")
            return
        }
        if (description.trim().length < 20) {
            toast.error("Please provide a more detailed description (at least 20 characters)")
            return
        }

        setIsPending(true)
        const result = await createGrievance({
            category: category as Category,
            description: description.trim(),
            challan_number: challanNumber.trim() || undefined,
            lodged_via: "web",
        })
        setIsPending(false)

        if (result.error) {
            toast.error(result.error)
            return
        }

        toast.success(`Grievance #${result.data?.ticket_number} submitted successfully!`)
        router.push("/track-grievance")
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            {/* Header */}
            <div>
                <Button variant="ghost" size="sm" asChild className="-ml-2 mb-3 gap-1.5 text-muted-foreground">
                    <Link href="/track-grievance">
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to My Grievances
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Lodge New Grievance</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Submit a formal complaint about an incorrect ONOC traffic challan
                </p>
            </div>

            {/* AI hint banner */}
            <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <Bot className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="text-sm">
                    <span className="font-medium text-foreground">Prefer guided assistance?</span>{" "}
                    <span className="text-muted-foreground">
                        Our AI assistant walks you through the process step by step.
                    </span>{" "}
                    <Link href="/chatbot" className="font-medium text-primary underline-offset-4 hover:underline">
                        Use AI Chatbot →
                    </Link>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category selection */}
                <div className="space-y-3">
                    <Label className="text-sm font-semibold">
                        Grievance Category <span className="text-destructive">*</span>
                    </Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.value}
                                type="button"
                                onClick={() => setCategory(cat.value)}
                                className={`rounded-lg border p-3.5 text-left transition-colors ${category === cat.value
                                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                                    : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
                                    }`}
                            >
                                <p className="text-sm font-medium leading-tight">{cat.label}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground leading-snug">{cat.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Challan Number (optional) */}
                <div className="space-y-2">
                    <Label htmlFor="challan_number" className="text-sm font-semibold">
                        Challan Number{" "}
                        <span className="font-normal text-muted-foreground">(Optional)</span>
                    </Label>
                    <Input
                        id="challan_number"
                        value={challanNumber}
                        onChange={(e) => setChallanNumber(e.target.value)}
                        placeholder="e.g. GJ01ONOC2024001234"
                        className="font-mono"
                        disabled={isPending}
                    />
                    <p className="text-xs text-muted-foreground">
                        Found on your challan notice. Providing this helps us verify your case faster.
                    </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold">
                        Grievance Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your grievance in detail. Include what happened, why the challan is incorrect, and any relevant dates, locations, or evidence."
                        rows={6}
                        disabled={isPending}
                        className="resize-none"
                    />
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                            Minimum 20 characters. Be as specific as possible.
                        </p>
                        <span className={`text-xs ${description.length < 20 ? "text-muted-foreground" : "text-green-600"}`}>
                            {description.length} chars
                        </span>
                    </div>
                </div>

                {/* Info note */}
                <div className="flex items-start gap-2.5 rounded-lg bg-muted/60 p-3.5">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                        Once submitted, your grievance will be assigned a unique ticket number and reviewed
                        by our team within 5–7 working days. You will receive real-time notifications on
                        every status update.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Button type="submit" disabled={isPending || !category || description.trim().length < 20} className="gap-2">
                        {isPending ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
                        ) : (
                            <><Send className="h-4 w-4" /> Submit Grievance</>
                        )}
                    </Button>
                    <Button type="button" variant="ghost" asChild disabled={isPending}>
                        <Link href="/track-grievance">Cancel</Link>
                    </Button>
                </div>
            </form>
        </div>
    )
}
