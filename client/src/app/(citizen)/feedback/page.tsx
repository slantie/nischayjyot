'use client'

import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { Loader2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export default function FeedbackPage() {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [difficulties, setDifficulties] = useState("")
    const [suggestions, setSuggestions] = useState("")
    const [isPending, setIsPending] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        if (rating === 0) {
            toast.error("Please select a star rating")
            return
        }

        setIsPending(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            toast.error("You must be signed in to submit feedback")
            setIsPending(false)
            return
        }

        const { error } = await supabase.from("feedback").insert({
            citizen_id: user.id,
            satisfaction_rating: rating,
            difficulties_faced: difficulties.trim() || null,
            suggestions: suggestions.trim() || null,
        })

        setIsPending(false)

        if (error) {
            toast.error(error.message)
            return
        }

        setSubmitted(true)
        toast.success("Thank you for your feedback!")
    }

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-8 w-8 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                    ))}
                </div>
                <h2 className="text-2xl font-bold">Thank you! 🙏</h2>
                <p className="text-muted-foreground max-w-sm">
                    Your feedback helps us improve NishchayJyot for all citizens.
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Share Your Feedback</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Help us improve the grievance portal experience
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Rate your experience</CardTitle>
                    <CardDescription>
                        How satisfied are you with NishchayJyot's grievance process?
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Star Rating */}
                        <div className="space-y-2">
                            <Label>Overall Satisfaction</Label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setRating(s)}
                                        onMouseEnter={() => setHover(s)}
                                        onMouseLeave={() => setHover(0)}
                                        className="transition-transform hover:scale-110 focus:outline-none"
                                        aria-label={`${s} star${s > 1 ? "s" : ""}`}
                                    >
                                        {s <= (hover || rating) ? (
                                            <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                                        ) : (
                                            <Star className="h-8 w-8 text-muted-foreground/40" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                                </p>
                            )}
                        </div>

                        {/* Difficulties */}
                        <div className="space-y-2">
                            <Label htmlFor="difficulties">Any difficulties you faced? (Optional)</Label>
                            <Textarea
                                id="difficulties"
                                placeholder="Describe any issues or confusion during the grievance process…"
                                rows={3}
                                value={difficulties}
                                onChange={(e) => setDifficulties(e.target.value)}
                                disabled={isPending}
                            />
                        </div>

                        {/* Suggestions */}
                        <div className="space-y-2">
                            <Label htmlFor="suggestions">Suggestions for improvement (Optional)</Label>
                            <Textarea
                                id="suggestions"
                                placeholder="What could we do better?"
                                rows={3}
                                value={suggestions}
                                onChange={(e) => setSuggestions(e.target.value)}
                                disabled={isPending}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting…</>
                            ) : (
                                "Submit Feedback"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
