import Link from "next/link"
import { Scale, ShieldCheck, FileText, Bell } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            {/* Left panel — navy */}
            <div className="hidden w-96 flex-shrink-0 flex-col justify-between bg-primary p-10 lg:flex">
                <div>
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                            <Scale className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-tight text-white">NishchayJyot</p>
                            <p className="text-[10px] font-medium uppercase tracking-widest text-white/60">Challan Grievance Portal</p>
                        </div>
                    </Link>

                    <div className="mt-14 space-y-4">
                        <h2 className="text-2xl font-bold leading-snug text-white">
                            Dispute your traffic challans fairly and transparently
                        </h2>
                        <p className="text-sm text-white/70">
                            An AI-powered grievance redressal system built for the ONOC initiative. Secure, fast, and citizen-first.
                        </p>
                    </div>

                    <div className="mt-10 space-y-3">
                        {[
                            { icon: ShieldCheck, text: "Secure identity verification" },
                            { icon: FileText, text: "Transparent grievance tracking" },
                            { icon: Bell, text: "Real-time status notifications" },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3 text-sm text-white/80">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
                                    <Icon className="h-4 w-4 text-white" />
                                </div>
                                {text}
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-white/40">© 2023 NishchayJyot · SSIP Hackathon Project</p>
            </div>

            {/* Right panel — form */}
            <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-12 sm:px-8">
                {/* Mobile logo */}
                <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <Scale className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-base font-bold text-primary">NishchayJyot</span>
                </Link>

                {children}
            </div>
        </div>
    )
}
