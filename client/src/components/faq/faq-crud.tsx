'use client'

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createFAQ, updateFAQ, deleteFAQ, toggleFAQPublished } from "@/actions/faqs"
import type { FAQ } from "@/lib/supabase/types"

// ── FAQ Form Dialog ─────────────────────────────────────────────────────────────

type FAQFormState = {
    question: string
    answer: string
    category: string
    language: "en" | "hi" | "gu"
    is_published: boolean
}

const LANG_LABELS: Record<string, string> = { en: "English", hi: "हिंदी", gu: "ગુજરાતી" }

function FAQFormDialog({
    faq,
    onSave,
}: {
    faq?: FAQ
    onSave?: () => void
}) {
    const isEdit = !!faq
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [form, setForm] = useState<FAQFormState>({
        question: faq?.question ?? "",
        answer: faq?.answer ?? "",
        category: faq?.category ?? "general",
        language: (faq?.language as "en" | "hi" | "gu") ?? "en",
        is_published: faq?.is_published ?? true,
    })

    function handleChange(field: keyof FAQFormState, value: string | boolean) {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    function handleSave() {
        if (!form.question.trim() || !form.answer.trim()) {
            toast.error("Question and answer are required")
            return
        }
        startTransition(async () => {
            const result = isEdit
                ? await updateFAQ(faq!.id, form)
                : await createFAQ({ ...form, display_order: 0 })

            if (result.error) {
                toast.error(result.error)
                return
            }
            toast.success(isEdit ? "FAQ updated!" : "FAQ created!")
            setOpen(false)
            onSave?.()
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isEdit ? (
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                ) : (
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Add FAQ
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update the question and answer." : "Add a new frequently asked question."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="faq-question">Question</Label>
                        <Input
                            id="faq-question"
                            placeholder="Enter the question…"
                            value={form.question}
                            onChange={e => handleChange("question", e.target.value)}
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="faq-answer">Answer</Label>
                        <Textarea
                            id="faq-answer"
                            placeholder="Enter the detailed answer…"
                            rows={4}
                            value={form.answer}
                            onChange={e => handleChange("answer", e.target.value)}
                            disabled={isPending}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Category</Label>
                            <Input
                                placeholder="e.g. general, payment"
                                value={form.category}
                                onChange={e => handleChange("category", e.target.value)}
                                disabled={isPending}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Language</Label>
                            <Select
                                value={form.language}
                                onValueChange={v => handleChange("language", v)}
                                disabled={isPending}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="hi">हिंदी</SelectItem>
                                    <SelectItem value="gu">ગુજરાતી</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isPending}>
                        {isPending ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</>
                        ) : isEdit ? "Save Changes" : "Create FAQ"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ── Delete Button ───────────────────────────────────────────────────────────────

function DeleteFAQButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition()

    function handleDelete() {
        startTransition(async () => {
            const result = await deleteFAQ(id)
            if (result.error) {
                toast.error(result.error)
                return
            }
            toast.success("FAQ deleted")
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive hover:text-destructive">
                    {isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. The FAQ will be permanently removed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

// ── Toggle Publish Button ───────────────────────────────────────────────────────

function TogglePublishButton({ id, is_published }: { id: string; is_published: boolean }) {
    const [isPending, startTransition] = useTransition()

    function handleToggle() {
        startTransition(async () => {
            const result = await toggleFAQPublished(id, !is_published)
            if (result.error) {
                toast.error(result.error)
                return
            }
            toast.success(is_published ? "FAQ unpublished" : "FAQ published")
        })
    }

    return (
        <Badge
            variant={is_published ? "default" : "secondary"}
            className="cursor-pointer text-xs select-none"
            onClick={handleToggle}
            role="button"
            aria-label={is_published ? "Click to unpublish" : "Click to publish"}
        >
            {isPending ? "…" : is_published ? "Published" : "Draft"}
        </Badge>
    )
}

// ── Main Export: FAQ Table for Admin ────────────────────────────────────────────

export function FAQAdminList({ faqs }: { faqs: FAQ[] }) {
    const grouped = faqs.reduce<Record<string, FAQ[]>>((acc, faq) => {
        const lang = faq.language
        if (!acc[lang]) acc[lang] = []
        acc[lang].push(faq)
        return acc
    }, {})

    return (
        <div className="space-y-6">
            {/* Add button */}
            <div className="flex justify-end">
                <FAQFormDialog />
            </div>

            {Object.entries(grouped).map(([lang, items]) => (
                <section key={lang}>
                    <div className="flex items-center gap-2 mb-3">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            {LANG_LABELS[lang] ?? lang}
                        </h2>
                        <Badge variant="secondary" className="text-xs">{items.length}</Badge>
                    </div>
                    <div className="space-y-2">
                        {items.map(faq => (
                            <div key={faq.id} className="flex items-start gap-3 rounded-lg border bg-card p-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-1">{faq.question}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{faq.answer}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">{faq.category}</Badge>
                                        <TogglePublishButton id={faq.id} is_published={faq.is_published} />
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-1">
                                    <FAQFormDialog faq={faq} />
                                    <DeleteFAQButton id={faq.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}

            {faqs.length === 0 && (
                <div className="rounded-xl border border-dashed p-12 text-center">
                    <p className="text-muted-foreground text-sm">
                        No FAQs yet. Click "Add FAQ" to create the first one.
                    </p>
                </div>
            )}
        </div>
    )
}
