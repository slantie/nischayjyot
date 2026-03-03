import { createClient } from "@/lib/supabase/server"
import { SYSTEM_PROMPT } from "@/lib/ai/chatbot"

export const runtime = "edge"

// Streaming chat endpoint — uses OpenAI API when key is configured,
// falls back to a structured step-based mock response otherwise.
export async function POST(req: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        })
    }

    const body = await req.json() as { messages: { role: string; content: string }[] }
    const messages = body.messages ?? []

    const apiKey = process.env.OPENAI_API_KEY

    // ── Real AI path ──────────────────────────────────────────────────────────
    if (apiKey && apiKey !== "placeholder" && apiKey.startsWith("sk-")) {
        const openaiMessages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
        ]

        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: openaiMessages,
                stream: true,
                max_tokens: 600,
                temperature: 0.5,
            }),
        })

        if (!openaiRes.ok) {
            const err = await openaiRes.json().catch(() => ({}))
            return new Response(
                JSON.stringify({ error: (err as Record<string, unknown>).error ?? "OpenAI error" }),
                { status: 502, headers: { "Content-Type": "application/json" } }
            )
        }

        // Stream the SSE response directly to the client
        return new Response(openaiRes.body, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        })
    }

    // ── Fallback mock path (no valid API key) ─────────────────────────────────
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? ""
    const reply = generateMockReply(lastUserMessage, messages.length)

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
        start(controller) {
            // Simulate token-by-token streaming
            const words = reply.split(" ")
            let i = 0
            const interval = setInterval(() => {
                if (i >= words.length) {
                    controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
                    controller.close()
                    clearInterval(interval)
                    return
                }
                const token = (i === 0 ? words[i] : " " + words[i])
                const chunk = JSON.stringify({
                    choices: [{ delta: { content: token }, finish_reason: null }],
                })
                controller.enqueue(encoder.encode(`data: ${chunk}\n\n`))
                i++
            }, 30)
        },
    })

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "X-AI-Mode": "mock",
        },
    })
}

function generateMockReply(userMessage: string, turnCount: number): string {
    const lower = userMessage.toLowerCase()

    if (turnCount <= 1) {
        return "Hello! I'm the NishchayJyot AI Assistant. I can help you lodge a grievance for an incorrect ONOC challan, check grievance status, or answer your questions. How can I help you today?"
    }

    if (lower.includes("lodge") || lower.includes("grievance") || lower.includes("file") || lower.includes("submit")) {
        return "To lodge a grievance, you can either use our guided form at /new-grievance or continue chatting with me. Please tell me: what type of issue are you facing? For example — false challan, wrong amount, wrong vehicle, duplicate challan, or payment issue?"
    }

    if (lower.includes("status") || lower.includes("track") || lower.includes("ticket")) {
        return "To check your grievance status, please visit the My Grievances section. You can also search for your ticket number there. Would you like me to guide you through the process?"
    }

    if (lower.includes("false") || lower.includes("didn't") || lower.includes("not mine")) {
        return "Understood — this sounds like a false challan case. Please visit /new-grievance and select 'False Challan' as the category. Describe the incident in detail, including the date, time, and why you believe the challan is incorrect. Do you have your challan number handy?"
    }

    if (lower.includes("wrong amount") || lower.includes("excess") || lower.includes("overcharged")) {
        return "This sounds like a wrong amount grievance. Please lodge it at /new-grievance selecting 'Wrong Amount'. Include the challan number, the amount charged, and the amount you believe is correct."
    }

    if (lower.includes("payment") || lower.includes("paid") || lower.includes("still showing")) {
        return "Payment issues are resolved quickly once verified. Please lodge a grievance at /new-grievance selecting 'Payment Issue'. Include your challan number and payment transaction reference if available."
    }

    if (lower.includes("faq") || lower.includes("help") || lower.includes("how")) {
        return "You can find answers to common questions on our FAQ page at /faq. Topics covered include the grievance process, challan verification, and resolution timelines. Is there a specific question I can help with right now?"
    }

    return "I understand your concern. To best assist you, please lodge a formal grievance at /new-grievance so our team can review your case. You can also track your existing grievances at /track-grievance. Is there anything else I can help clarify?"
}
