import Link from "next/link"
import { Shield, Bot, BarChart3, Bell, ArrowRight, Scale, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white font-sans">
            {/* ── Navbar ── */}
            <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                            <Scale className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                            <span className="block text-base font-bold leading-tight tracking-tight text-primary">NishchayJyot</span>
                            <span className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Challan Grievance Portal</span>
                        </div>
                    </div>
                    <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground sm:flex">
                        <Link href="#features" className="transition-colors hover:text-primary">Features</Link>
                        <Link href="#how-it-works" className="transition-colors hover:text-primary">How it works</Link>
                        <Link href="/faq" className="transition-colors hover:text-primary">FAQ</Link>
                    </nav>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="font-medium" asChild>
                            <Link href="/login">Sign In</Link>
                        </Button>
                        <Button size="sm" className="gap-1.5 font-semibold" asChild>
                            <Link href="/register">Register <ArrowRight className="h-3.5 w-3.5" /></Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-linear-to-br from-primary via-primary/90 to-blue-900 px-4 py-24 sm:px-6 lg:px-8">
                {/* decorative circles */}
                <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border border-white/10 opacity-30" />
                    <div className="absolute -right-12 -top-12 h-72 w-72 rounded-full border border-white/10 opacity-20" />
                    <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-4xl text-center">
                    <Badge className="mb-6 bg-accent/20 text-accent-foreground border-accent/30 text-xs font-semibold uppercase tracking-wider">
                        SSIP Hackathon 2023 · ONOC Initiative
                    </Badge>
                    <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Resolve Your Traffic<br />
                        <span className="text-accent">Challan Disputes</span>
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-base text-white/80 sm:text-lg">
                        NishchayJyot empowers citizens to lodge, track, and resolve traffic challan grievances
                        with AI-powered assistance and transparent administration.
                    </p>
                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <Button size="lg" className="gap-2 bg-accent px-8 text-white hover:bg-accent/90 font-semibold shadow-lg" asChild>
                            <Link href="/register">
                                Lodge a Grievance <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="gap-2 border-white/30 bg-white/10 px-8 text-white hover:bg-white/20 hover:text-white" asChild>
                            <Link href="/login">Track Existing Grievance</Link>
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="mt-14 grid grid-cols-3 divide-x divide-white/20 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
                        {[
                            { label: "Cities Covered", value: "5" },
                            { label: "Grievance Types", value: "6+" },
                            { label: "Languages", value: "3+" },
                        ].map((stat) => (
                            <div key={stat.label} className="px-6 py-5 text-center">
                                <div className="text-3xl font-bold text-white">{stat.value}</div>
                                <div className="mt-0.5 text-xs font-medium uppercase tracking-wide text-white/70">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section id="how-it-works" className="bg-muted/40 px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-12 text-center">
                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Process</p>
                        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">How it works</h2>
                        <p className="mt-3 text-muted-foreground">Resolve your challan dispute in three simple steps.</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {steps.map((step, i) => (
                            <div key={step.title} className="relative rounded-xl border bg-white p-6 shadow-sm">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
                                    {i + 1}
                                </div>
                                <h3 className="mb-2 font-semibold text-foreground">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 text-center">
                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Features</p>
                        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Everything you need</h2>
                        <p className="mt-3 text-muted-foreground">A complete platform for citizens to resolve challan disputes fairly and transparently.</p>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((f) => (
                            <Card key={f.title} className="border shadow-sm transition-shadow hover:shadow-md">
                                <CardContent className="p-6">
                                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                                        <f.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="mb-1.5 font-semibold text-foreground">{f.title}</h3>
                                    <p className="text-sm text-muted-foreground">{f.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-accent px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">Ready to resolve your grievance?</h2>
                    <p className="mb-8 text-white/85">
                        Register now and get AI-powered assistance to dispute your traffic challan — fast, transparent, and hassle-free.
                    </p>
                    <Button size="lg" className="gap-2 bg-white px-8 font-semibold text-accent hover:bg-white/90 shadow-lg" asChild>
                        <Link href="/register">
                            Create Account <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-primary px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <Scale className="h-5 w-5 text-white/70" />
                        <span className="font-semibold text-white">NishchayJyot</span>
                        <span className="text-white/50">— Challan Grievance Portal</span>
                    </div>
                    <div className="flex gap-6 text-sm text-white/70">
                        <Link href="/faq" className="transition-colors hover:text-white">FAQ</Link>
                        <Link href="/login" className="transition-colors hover:text-white">Sign In</Link>
                        <Link href="/register" className="transition-colors hover:text-white">Register</Link>
                    </div>
                    <span className="text-xs text-white/50">© 2023 NishchayJyot · SSIP Hackathon Project</span>
                </div>
            </footer>
        </div>
    )
}

const features = [
    {
        icon: Bot,
        title: "AI-Powered Chatbot",
        description: "Our AI assistant guides you through grievance registration, looks up your challan details, and answers queries instantly.",
    },
    {
        icon: Bell,
        title: "Real-time Tracking",
        description: "Get instant notifications when your grievance status changes. Track every step from submission to resolution.",
    },
    {
        icon: BarChart3,
        title: "Transparent Analytics",
        description: "Admins get comprehensive dashboards with violation breakdowns, geographic maps, and payment analytics.",
    },
    {
        icon: Shield,
        title: "Secure & Private",
        description: "Row-level security ensures your data is visible only to you and authorized administrators.",
    },
]

const steps = [
    {
        title: "Register your account",
        description: "Create an account with your vehicle number and contact details. Quick, secure, and takes less than 2 minutes.",
    },
    {
        title: "Find your challan & describe the issue",
        description: "Enter your vehicle number to fetch all associated challans. Use the AI chatbot or the manual form to lodge your grievance.",
    },
    {
        title: "Track resolution in real-time",
        description: "Our admins review your grievance and evidence. You receive live notifications as the status progresses to resolution.",
    },
]