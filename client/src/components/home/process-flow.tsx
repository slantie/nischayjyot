"use client"

import { useEffect, useRef, useState } from "react"
import { FileText, Search, CheckCircle2, Star } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Step = {
  icon: LucideIcon
  title: string
  desc: string
  bgColor: string
  borderColor: string
  iconColor: string
  numBg: string
  accentText: string
}

const steps: Step[] = [
  {
    icon: FileText,
    title: "File Complaint",
    desc: "Raise your complaint through the portal — quick, secure registration.",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-600",
    numBg: "bg-blue-600",
    accentText: "text-blue-600",
  },
  {
    icon: Search,
    title: "Assessment",
    desc: "Your complaint is investigated and checked for validity and eligibility.",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    iconColor: "text-sky-600",
    numBg: "bg-sky-600",
    accentText: "text-sky-600",
  },
  {
    icon: CheckCircle2,
    title: "Resolution",
    desc: "Once resolved, you receive an immediate notification with the outcome.",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    iconColor: "text-emerald-600",
    numBg: "bg-emerald-600",
    accentText: "text-emerald-600",
  },
  {
    icon: Star,
    title: "Feedback",
    desc: "Share your experience and help us improve the service for everyone.",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    iconColor: "text-amber-600",
    numBg: "bg-amber-600",
    accentText: "text-amber-600",
  },
]

export function ProcessFlow() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref}>
      {/* ── Desktop: horizontal timeline ── */}
      <div className="relative hidden lg:block">
        {/* Connecting line — draws left to right on scroll */}
        <div
          className="absolute top-7 left-[12.5%] right-[12.5%] h-px bg-border"
          style={{
            transform: inView ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.15s",
          }}
        />

        <div className="grid grid-cols-4 gap-10">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.5s ease ${0.25 + i * 0.13}s, transform 0.5s ease ${0.25 + i * 0.13}s`,
              }}
            >
              {/* Node circle */}
              <div
                className={`relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 ${step.borderColor} ${step.bgColor} shadow-sm`}
              >
                <step.icon className={`h-6 w-6 ${step.iconColor}`} />
                {/* Step number badge */}
                <span
                  className={`absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${step.numBg}`}
                >
                  {i + 1}
                </span>
              </div>

              <p className={`mb-1.5 text-[10px] font-bold uppercase tracking-widest ${step.accentText}`}>
                Step {i + 1}
              </p>
              <h3 className="mb-2 text-sm font-bold text-foreground">{step.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile: vertical stepper ── */}
      <div className="lg:hidden">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="flex gap-4"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(-20px)",
              transition: `opacity 0.45s ease ${i * 0.1}s, transform 0.45s ease ${i * 0.1}s`,
            }}
          >
            {/* Left column: circle + connecting line */}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 ${step.borderColor} ${step.bgColor}`}
              >
                <step.icon className={`h-5 w-5 ${step.iconColor}`} />
              </div>
              {i < steps.length - 1 && (
                <div
                  className="mt-1 w-px flex-1 bg-border"
                  style={{
                    minHeight: 36,
                    transform: inView ? "scaleY(1)" : "scaleY(0)",
                    transformOrigin: "top",
                    transition: `transform 0.4s ease ${0.1 + i * 0.1}s`,
                  }}
                />
              )}
            </div>

            {/* Right column: content */}
            <div className="pb-7 pt-0.5">
              <p className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${step.accentText}`}>
                Step {i + 1}
              </p>
              <h3 className="mb-1.5 text-sm font-bold text-foreground">{step.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
