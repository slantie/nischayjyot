import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  Bot,
  BarChart3,
  Bell,
  ArrowRight,
  ArrowUpRight,
  Star,
  ChevronDown,
  FileText,
  Search,
  CheckCircle2,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Image
              src="/nj-logo.png"
              alt="NishchayJyot"
              width={140}
              height={49}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground sm:flex">
            <Link
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="transition-colors hover:text-foreground"
            >
              How it works
            </Link>
            <Link
              href="#faq"
              className="transition-colors hover:text-foreground"
            >
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="font-medium text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" className="gap-1.5 font-semibold" asChild>
              <Link href="/register">
                Get started <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:px-6 lg:pt-28 lg:pb-20 lg:px-8">
        {/* Subtle grid texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 grid-overlay-light"
        />
        {/* Soft glow blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-primary/5 blur-[80px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-primary/4 blur-[60px]"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <Badge
            variant="outline"
            className="mb-5 border-primary/25 bg-primary/6 text-primary text-[11px] font-semibold uppercase tracking-widest"
          >
            SSIP Hackathon 2023 · ONOC Initiative
          </Badge>

          <h1 className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Dispute Traffic Challans
            <br />
            <span className="text-primary">Fairly &amp; Transparently</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            NishchayJyot is an AI-powered grievance redressal platform for
            traffic challans. Lodge, track, and resolve disputes — all in one
            place.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="h-11 gap-2 px-8 font-semibold shadow-sm"
              asChild
            >
              <Link href="/register">
                Lodge a Grievance <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 gap-2 px-8 font-medium"
              asChild
            >
              <Link href="/login">Track Existing</Link>
            </Button>
          </div>

          {/* Stats row */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-10 border-t pt-10 sm:gap-16">
            {heroStats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-foreground sm:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── App Mockup ── */}
      <section className="bg-muted/40 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
              Platform Preview
            </p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Built for clarity and speed
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              A clean dashboard for managing every step — from submission to
              resolution.
            </p>
          </div>

          {/* Browser chrome */}
          <div className="overflow-hidden rounded-xl border bg-card shadow-lg">
            <div className="flex items-center gap-3 border-b bg-muted/70 px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-300" />
              </div>
              <div className="mx-auto flex h-6 w-64 items-center justify-center rounded-full border bg-background text-xs text-muted-foreground">
                nishchayjyot.vercel.app/home
              </div>
            </div>

            <div className="flex h-72 divide-x">
              {/* Sidebar mock */}
              <div className="flex w-44 flex-shrink-0 flex-col bg-sidebar py-3 px-2 gap-0.5">
                <div className="mb-2 flex items-center gap-2 px-2 py-2">
                  <div className="h-4 w-4 rounded bg-primary/70" />
                  <div className="h-2.5 w-20 rounded bg-white/25" />
                </div>
                {mockSidebarItems.map(({ label, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 ${active ? "bg-accent/80" : ""}`}
                  >
                    <div
                      className={`h-2.5 w-2.5 rounded-sm ${active ? "bg-sidebar-primary-foreground" : "bg-white/30"}`}
                    />
                    <span
                      className={`text-xs ${active ? "font-medium text-sidebar-primary-foreground" : "text-white/50"}`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Main content mock */}
              <div className="flex-1 overflow-hidden bg-background p-4">
                <div className="mb-4">
                  <div className="mb-1 h-3 w-40 rounded bg-foreground/15" />
                  <div className="h-2 w-56 rounded bg-muted-foreground/20" />
                </div>
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {mockStatCards.map(({ bg, bar }, i) => (
                    <div key={i} className={`rounded-lg border ${bg} p-2.5`}>
                      <div className={`mb-2 h-1.5 w-8 rounded ${bar}`} />
                      <div className="h-4 w-10 rounded bg-foreground/15" />
                      <div className="mt-1 h-1.5 w-14 rounded bg-muted-foreground/20" />
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  {mockGrievanceRows.map(({ id, statusCls, status }) => (
                    <div
                      key={id}
                      className="flex items-center justify-between rounded border bg-card px-2.5 py-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                        <span className="font-mono text-xs text-muted-foreground">
                          {id}
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusCls}`}
                      >
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
              Features
            </p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Everything you need
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              A complete platform for citizens and administrators to work toward
              fair, transparent outcomes.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative cursor-default rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/25"
              >
                <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-muted-foreground/0 transition-all duration-200 group-hover:text-primary/40" />
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 ring-1 ring-primary/15">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process Flow ── */}
      <section
        id="how-it-works"
        className="bg-muted/40 px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
              Process
            </p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              From filing to resolution — four clear steps.
            </p>
          </div>

          {/* Chevron flow — desktop */}
          <div className="hidden md:flex items-stretch">
            {processFlow.map((step, i) => (
              <div
                key={step.title}
                className={`flex flex-1 flex-col items-center justify-center px-8 py-8 text-center ${step.bg} ${i === 0 ? "chevron-start" : i === processFlow.length - 1 ? "chevron-end" : "chevron-step"} -ml-4 first:ml-0`}
              >
                <div
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/60 ring-2 ${step.ring}`}
                >
                  <step.icon className={`h-5 w-5 ${step.iconColor}`} />
                </div>
                <p className={`text-sm font-bold ${step.titleColor}`}>
                  {step.title}
                </p>
                <p
                  className={`mt-1.5 text-xs leading-relaxed ${step.descColor}`}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Vertical flow — mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {processFlow.map((step, i) => (
              <div
                key={step.title}
                className={`flex items-start gap-4 rounded-xl ${step.bg} px-5 py-4`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/60 ring-2 ${step.ring}`}
                >
                  <step.icon className={`h-4 w-4 ${step.iconColor}`} />
                </div>
                <div>
                  <p className={`text-sm font-bold ${step.titleColor}`}>
                    {i + 1}. {step.title}
                  </p>
                  <p
                    className={`mt-0.5 text-xs leading-relaxed ${step.descColor}`}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
              Testimonials
            </p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Citizens speak up
            </h2>
            <p className="mt-3 text-muted-foreground">
              Hear from people who successfully resolved their challan disputes.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-accent text-accent"
                    />
                  ))}
                </div>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/8 text-xs font-bold text-primary">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="bg-muted/40 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
              FAQ
            </p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-muted-foreground">
              Everything you need to know about the challan grievance process.
            </p>
          </div>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border bg-card px-5 py-4 [&>summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-foreground">
                  {faq.q}
                  <ChevronDown className="ml-4 h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-foreground px-4 py-20 sm:px-6 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 grid-overlay-dark"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="mb-3 text-3xl font-bold text-background sm:text-4xl">
            Ready to resolve your grievance?
          </h2>
          <p className="mb-8 text-base leading-relaxed text-background/65">
            Join citizens who have successfully disputed unfair challans.
            AI-powered, fast, and completely transparent.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="h-11 gap-2 bg-primary px-8 font-semibold text-white shadow-md hover:bg-primary/90"
              asChild
            >
              <Link href="/register">
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 gap-2 border-background/20 bg-background/5 px-8 text-background hover:bg-background/10 hover:text-background"
              asChild
            >
              <Link href="/login">Sign In Instead</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t bg-card px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="mb-4 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                  <Scale className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="text-sm font-bold text-foreground">
                  NishchayJyot
                </span>
              </Link>
              <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
                An AI-powered challan grievance portal built for the SSIP
                Hackathon 2023 under the ONOC initiative.
              </p>
            </div>

            {/* Portal */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                Portal
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {footerPortalLinks.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get Started */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                Get Started
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {footerGetStartedLinks.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Project */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                Project
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>SSIP Hackathon 2023</li>
                <li>ONOC — One Nation One Challan</li>
                <li>LDRP Institute of Technology</li>
                <li>Gandhinagar, Gujarat</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>© 2023 NishchayJyot · SSIP Hackathon Project</p>
            <p>Traffic Challan Grievance Redressal System</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Data ─────────────────────────────────────────────────────────────── */

const heroStats = [
  { value: "5+", label: "Cities Covered" },
  { value: "1,200+", label: "Grievances Filed" },
  { value: "87%", label: "Resolution Rate" },
];

const mockSidebarItems = [
  { label: "Home", active: false },
  { label: "My Grievances", active: true },
  { label: "AI Chatbot", active: false },
  { label: "FAQ", active: false },
  { label: "Notifications", active: false },
];

const mockStatCards = [
  { bg: "bg-primary/5", bar: "bg-primary/50" },
  { bg: "bg-accent/8", bar: "bg-accent/60" },
  { bg: "bg-muted", bar: "bg-muted-foreground/40" },
];

const mockGrievanceRows = [
  {
    id: "#GRV-001",
    statusCls: "bg-amber-100 text-amber-700",
    status: "Pending",
  },
  {
    id: "#GRV-002",
    statusCls: "bg-green-100 text-green-700",
    status: "Resolved",
  },
  {
    id: "#GRV-003",
    statusCls: "bg-blue-100 text-blue-700",
    status: "In Review",
  },
];

const features = [
  {
    icon: Bot,
    title: "AI-Powered Chatbot",
    description:
      "Our AI assistant guides you through grievance registration, looks up challan details, and answers queries instantly.",
  },
  {
    icon: Bell,
    title: "Real-time Tracking",
    description:
      "Get instant notifications when your grievance status changes — from submission to final resolution.",
  },
  {
    icon: BarChart3,
    title: "Transparent Analytics",
    description:
      "Admins get comprehensive dashboards with violation breakdowns and payment analytics.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Row-level security ensures your data is visible only to you and authorized administrators.",
  },
];

const processFlow = [
  {
    icon: FileText,
    title: "File Complaint",
    desc: "Raise your complaint through the NishchayJyot portal — quick, secure registration.",
    bg: "bg-blue-50",
    ring: "ring-primary/30",
    iconColor: "text-primary",
    titleColor: "text-primary",
    descColor: "text-primary/70",
  },
  {
    icon: Search,
    title: "Assessment",
    desc: "Your complaint is investigated and checked for validity and eligibility.",
    bg: "bg-sky-50",
    ring: "ring-sky-400/40",
    iconColor: "text-sky-600",
    titleColor: "text-sky-700",
    descColor: "text-sky-600/70",
  },
  {
    icon: CheckCircle2,
    title: "Resolution",
    desc: "Once your complaint is resolved, you will be notified immediately.",
    bg: "bg-teal-50",
    ring: "ring-teal-400/40",
    iconColor: "text-teal-600",
    titleColor: "text-teal-700",
    descColor: "text-teal-600/70",
  },
  {
    icon: Star,
    title: "Feedback",
    desc: "Provide feedback on your experience and help us improve the service.",
    bg: "bg-amber-50",
    ring: "ring-amber-400/40",
    iconColor: "text-amber-600",
    titleColor: "text-amber-700",
    descColor: "text-amber-600/70",
  },
];

const testimonials = [
  {
    quote:
      "My challan had the wrong vehicle number printed on it. NishchayJyot helped me file the dispute in minutes — it was resolved within three days.",
    name: "Rajesh Kumar",
    initials: "RK",
    location: "Ahmedabad, Gujarat",
  },
  {
    quote:
      "The AI chatbot walked me through exactly what evidence to upload. My grievance was closed in under a week.",
    name: "Priya Shah",
    initials: "PS",
    location: "Surat, Gujarat",
  },
  {
    quote:
      "The real-time updates made the whole process transparent and stress-free. I always knew where my case stood.",
    name: "Amit Patel",
    initials: "AP",
    location: "Gandhinagar, Gujarat",
  },
];

const faqs = [
  {
    q: "What is NishchayJyot and how does it work?",
    a: "NishchayJyot is an AI-powered grievance redressal portal for traffic challans issued under the ONOC (One Nation One Challan) system. Citizens can register, find their challans, describe their dispute with evidence, and track the resolution — all through a single dashboard.",
  },
  {
    q: "What types of challan disputes can I raise?",
    a: "You can dispute challans for incorrect vehicle details, wrong violation type, technical errors in challan issuance, challans for vehicles you no longer own, or cases where you have evidence contradicting the violation record.",
  },
  {
    q: "How long does the grievance resolution process take?",
    a: "Most straightforward disputes are reviewed within 3–7 working days. You will receive real-time notifications at every stage of the review.",
  },
  {
    q: "What evidence should I submit with my grievance?",
    a: "Supporting documents may include photos of the vehicle, your vehicle registration certificate (RC), a driving license, CCTV footage if available, or any official document that contradicts the challan details.",
  },
  {
    q: "Do I need to pay the challan while my grievance is pending?",
    a: "You are advised to consult the applicable traffic regulations in your jurisdiction. NishchayJyot tracks and documents your dispute, but payment obligations are governed by the issuing authority's policies.",
  },
];

const footerPortalLinks: [string, string][] = [
  ["Home", "/"],
  ["Features", "#features"],
  ["How It Works", "#how-it-works"],
  ["FAQ", "#faq"],
];

const footerGetStartedLinks: [string, string][] = [
  ["Register", "/register"],
  ["Sign In", "/login"],
  ["Track Grievance", "/track-grievance"],
  ["AI Chatbot", "/chatbot"],
];
