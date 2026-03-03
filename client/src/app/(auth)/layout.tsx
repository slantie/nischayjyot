import Link from "next/link"
import Image from "next/image"
import { ShieldCheck, FileText, Bell } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            {/* Left panel — subtle blue-tinted */}
            <div className="hidden w-96 flex-shrink-0 flex-col justify-between border-r bg-muted/50 p-10 lg:flex">
                <div>
                    <Link href="/">
                        <Image
                            src="/nj-logo.png"
                            alt="NishchayJyot"
                            width={160}
                            height={56}
                            className="h-10 w-auto object-contain"
                        />
                    </Link>

                    <div className="mt-14 space-y-4">
                        <h2 className="text-2xl font-bold leading-snug text-foreground">
                            Dispute your traffic challans fairly and transparently
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            An AI-powered grievance redressal system built for the ONOC initiative. Secure, fast, and citizen-first.
                        </p>
                    </div>

                    <div className="mt-10 space-y-3">
                        {[
                            { icon: ShieldCheck, text: "Secure identity verification" },
                            { icon: FileText, text: "Transparent grievance tracking" },
                            { icon: Bell, text: "Real-time status notifications" },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/8 ring-1 ring-primary/15">
                                    <Icon className="h-4 w-4 text-primary" />
                                </div>
                                {text}
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-muted-foreground/60">© 2023 NishchayJyot · SSIP Hackathon Project</p>
            </div>

            {/* Right panel — form */}
            <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-12 sm:px-8">
                {/* Mobile logo */}
                <Link href="/" className="mb-8 lg:hidden">
                    <Image
                        src="/nj-logo.png"
                        alt="NishchayJyot"
                        width={140}
                        height={49}
                        className="h-9 w-auto object-contain"
                    />
                </Link>

                {children}
            </div>
        </div>
    )
}
