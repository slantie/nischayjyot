'use client'

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Bot, Send, Loader2, User, RefreshCw, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { createGrievance } from "@/actions/grievances"

type Message = {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

type ChatStep =
    | "greeting"
    | "ask_vehicle"
    | "ask_category"
    | "ask_description"
    | "ask_challan_number"
    | "confirm"
    | "done"

const CATEGORIES = [
    { value: "false_challan", label: "False Challan" },
    { value: "wrong_amount", label: "Wrong Amount" },
    { value: "wrong_vehicle", label: "Wrong Vehicle" },
    { value: "duplicate_challan", label: "Duplicate Challan" },
    { value: "payment_issue", label: "Payment Issue" },
    { value: "other", label: "Other" },
] as const

const SYSTEM_MESSAGES: Record<ChatStep, string> = {
    greeting:
        "Hello! 👋 I'm your NishchayJyot AI Assistant. I'm here to help you lodge a grievance for an incorrect ONOC traffic challan.\n\nLet's start — what is your **vehicle registration number**? (e.g. GJ01UV9043)",
    ask_vehicle: "Please enter your vehicle registration number to continue.",
    ask_category:
        "Got it! Now, please select the **category** that best describes your grievance:\n\n1. False Challan\n2. Wrong Amount\n3. Wrong Vehicle\n4. Duplicate Challan\n5. Payment Issue\n6. Other\n\nType the number or the category name.",
    ask_description:
        "Please describe your grievance in detail. Include:\n- What happened?\n- Why do you believe the challan is incorrect?\n- Any relevant dates, times, or locations.",
    ask_challan_number:
        "Do you have the **challan number** from the notice? If yes, please enter it. If not, type **skip**.",
    confirm: "Here's a summary of your grievance. Type **confirm** to submit or **cancel** to start again.",
    done: "Your grievance has been submitted! You can track it in the My Grievances section.",
}

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState<ChatStep>("greeting")
    const [data, setData] = useState({
        vehicle_number: "",
        category: "",
        description: "",
        challan_number: "",
    })
    const bottomRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Init with greeting
    useEffect(() => {
        addMessage("assistant", SYSTEM_MESSAGES.greeting)
    }, [])

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    function addMessage(role: "user" | "assistant", content: string) {
        setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role, content, timestamp: new Date() },
        ])
    }

    function getCategoryFromInput(input: string): string | null {
        const lower = input.toLowerCase().trim()
        if (lower === "1" || lower.includes("false")) return "false_challan"
        if (lower === "2" || lower.includes("wrong amount")) return "wrong_amount"
        if (lower === "3" || lower.includes("wrong vehicle")) return "wrong_vehicle"
        if (lower === "4" || lower.includes("duplicate")) return "duplicate_challan"
        if (lower === "5" || lower.includes("payment")) return "payment_issue"
        if (lower === "6" || lower.includes("other")) return "other"
        return null
    }

    async function handleSend() {
        const trimmed = input.trim()
        if (!trimmed || isLoading) return

        addMessage("user", trimmed)
        setInput("")
        setIsLoading(true)

        // Simulate processing delay for UX
        await new Promise((r) => setTimeout(r, 400))

        switch (step) {
            case "greeting":
            case "ask_vehicle": {
                const vn = trimmed.toUpperCase().replace(/\s+/g, "")
                if (!vn.match(/^[A-Z]{2}\d{2}[A-Z]{1,3}\d{4}$/)) {
                    addMessage(
                        "assistant",
                        "⚠️ That doesn't look like a valid vehicle number. Please enter it in the format **GJ01UV9043** (state code + district + series + number)."
                    )
                } else {
                    setData((d) => ({ ...d, vehicle_number: vn }))
                    addMessage("assistant", `✅ Vehicle **${vn}** noted.\n\n${SYSTEM_MESSAGES.ask_category}`)
                    setStep("ask_category")
                }
                break
            }

            case "ask_category": {
                const cat = getCategoryFromInput(trimmed)
                if (!cat) {
                    addMessage(
                        "assistant",
                        "Please type a number (1–6) or the category name from the list above."
                    )
                } else {
                    const label = CATEGORIES.find((c) => c.value === cat)?.label ?? cat
                    setData((d) => ({ ...d, category: cat }))
                    addMessage("assistant", `✅ Category: **${label}**\n\n${SYSTEM_MESSAGES.ask_description}`)
                    setStep("ask_description")
                }
                break
            }

            case "ask_description": {
                if (trimmed.length < 20) {
                    addMessage(
                        "assistant",
                        "Please provide a bit more detail — at least 20 characters so our team can properly review your case."
                    )
                } else {
                    setData((d) => ({ ...d, description: trimmed }))
                    addMessage("assistant", SYSTEM_MESSAGES.ask_challan_number)
                    setStep("ask_challan_number")
                }
                break
            }

            case "ask_challan_number": {
                const challanNumber = trimmed.toLowerCase() === "skip" ? "" : trimmed
                setData((d) => ({ ...d, challan_number: challanNumber }))

                const catLabel = CATEGORIES.find((c) => c.value === data.category)?.label ?? data.category
                const summary =
                    `📋 **Grievance Summary:**\n\n` +
                    `• **Vehicle:** ${data.vehicle_number}\n` +
                    `• **Category:** ${catLabel}\n` +
                    `• **Challan No.:** ${challanNumber || "Not provided"}\n` +
                    `• **Description:** ${data.description.slice(0, 100)}${data.description.length > 100 ? "..." : ""}\n\n` +
                    `Type **confirm** to submit or **cancel** to start over.`

                addMessage("assistant", summary)
                setStep("confirm")
                break
            }

            case "confirm": {
                if (trimmed.toLowerCase() === "cancel") {
                    setData({ vehicle_number: "", category: "", description: "", challan_number: "" })
                    setStep("ask_vehicle")
                    addMessage("assistant", "No problem! Let's start over. What is your vehicle registration number?")
                } else if (trimmed.toLowerCase() === "confirm") {
                    setIsLoading(true)
                    try {
                        const result = await createGrievance({
                            category: data.category as never,
                            description: data.description,
                            challan_number: data.challan_number || undefined,
                            lodged_via: "chatbot",
                        })

                        if (result.error) {
                            addMessage("assistant", `❌ Failed to submit: ${result.error}. Please try again or use the manual form.`)
                        } else {
                            addMessage(
                                "assistant",
                                `✅ Your grievance has been submitted! 🎉\n\n**Ticket #${result.data?.ticket_number}** has been created.\n\nYou can track its status in **My Grievances** or just wait for notifications.`
                            )
                            setStep("done")
                            toast.success(`Grievance #${result.data?.ticket_number} submitted!`)
                            setTimeout(() => router.push("/track-grievance"), 3000)
                        }
                    } finally {
                        setIsLoading(false)
                    }
                } else {
                    addMessage("assistant", 'Please type **confirm** to submit or **cancel** to start over.')
                }
                break
            }

            case "done":
                addMessage("assistant", "Your grievance is already submitted. Redirecting to your grievances…")
                router.push("/track-grievance")
                break
        }

        setIsLoading(false)
    }

    function handleReset() {
        setMessages([])
        setData({ vehicle_number: "", category: "", description: "", challan_number: "" })
        setStep("greeting")
        setTimeout(() => addMessage("assistant", SYSTEM_MESSAGES.greeting), 100)
    }

    return (
        <div className="flex h-full flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">AI Grievance Assistant</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Chat with our AI to lodge your challan grievance in minutes
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                        <RefreshCw className="h-4 w-4" /> Reset
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => router.push("/track-grievance")}>
                        <FileText className="h-4 w-4" /> My Grievances
                    </Button>
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 overflow-auto rounded-xl border bg-muted/20 p-4 space-y-4 min-h-100">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-3 max-w-[85%]",
                            msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                    >
                        {/* Avatar */}
                        <div
                            className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                msg.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted border"
                            )}
                        >
                            {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
                        </div>

                        {/* Bubble */}
                        <div
                            className={cn(
                                "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                                msg.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                                    : "bg-card border shadow-sm rounded-tl-sm"
                            )}
                        >
                            {/* Render simple markdown-ish bold */}
                            {msg.content.split("\n").map((line, i) => (
                                <p key={i} className={i > 0 ? "mt-1" : ""}>
                                    {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                                        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                                    )}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted border">
                            <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="rounded-2xl rounded-tl-sm bg-card border shadow-sm px-4 py-3">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex gap-3">
                <Input
                    id="chat-input"
                    placeholder={step === "done" ? "Grievance submitted!" : "Type your message…"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    disabled={isLoading || step === "done"}
                    className="flex-1"
                    autoComplete="off"
                    autoFocus
                />
                <Button onClick={handleSend} disabled={!input.trim() || isLoading || step === "done"} className="gap-2">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Send
                </Button>
            </div>
        </div>
    )
}
