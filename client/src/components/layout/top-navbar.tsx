'use client'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
    Bell, LogOut, User, ChevronDown, Search, Menu, X, Moon, Sun,
    Home, FileText, Bot, HelpCircle, MessageSquare,
    LayoutDashboard, BarChart3, Star, BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/actions/auth"

const citizenNavItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "My Grievances", href: "/track-grievance", icon: FileText },
    { label: "AI Chatbot", href: "/chatbot", icon: Bot },
    { label: "FAQ", href: "/faq", icon: HelpCircle },
    { label: "Feedback", href: "/feedback", icon: MessageSquare },
    { label: "Notifications", href: "/notifications", icon: Bell },
]

const adminNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Grievances", href: "/manage-grievances", icon: FileText },
    { label: "Reports", href: "/reports", icon: BarChart3 },
    { label: "Feedback", href: "/admin-feedback", icon: Star },
    { label: "Manage FAQs", href: "/manage-faqs", icon: BookOpen },
]

export function TopNavbar({
    userName,
    variant,
    notifCount = 0,
    pendingCount = 0,
}: {
    userName: string
    variant: "citizen" | "admin"
    notifCount?: number
    pendingCount?: number
}) {
    const pathname = usePathname()
    const router = useRouter()
    const { theme, setTheme } = useTheme()
    const [search, setSearch] = useState("")
    const [mobileOpen, setMobileOpen] = useState(false)

    const isAdmin = variant === "admin"
    const navItems = isAdmin ? adminNavItems : citizenNavItems

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        if (!search.trim()) return
        const dest = isAdmin
            ? `/manage-grievances?q=${encodeURIComponent(search)}`
            : `/track-grievance?q=${encodeURIComponent(search)}`
        router.push(dest)
        setSearch("")
        setMobileOpen(false)
    }

    function isActive(href: string) {
        return pathname === href || pathname.startsWith(href + "/")
    }

    return (
        <>
            <header className={`fixed top-0 right-0 left-0 z-30 flex h-14 items-center gap-2 border-b bg-background px-4 ${isAdmin ? "border-b-amber-200" : ""}`}>
                {/* Logo */}
                <Link href={isAdmin ? "/dashboard" : "/home"} className="flex shrink-0 items-center gap-2 mr-2">
                    <Image
                        src="/nj-logo.png"
                        alt="NishchayJyot"
                        width={130}
                        height={45}
                        className="h-8 w-auto object-contain"
                        priority
                    />
                    {isAdmin && (
                        <Badge className="text-[10px] px-1.5 py-0 h-5 bg-amber-100 text-amber-700 border border-amber-300 font-semibold hover:bg-amber-100">
                            Admin
                        </Badge>
                    )}
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-0.5">
                    {navItems.map((item) => {
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${active
                                    ? isAdmin
                                        ? "bg-amber-50 text-amber-700"
                                        : "bg-primary/8 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                            >
                                <item.icon className="h-3.5 w-3.5 shrink-0" />
                                {item.label}
                                {item.href === "/notifications" && notifCount > 0 && (
                                    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                                        {notifCount > 9 ? "9+" : notifCount}
                                    </span>
                                )}
                                {item.href === "/manage-grievances" && pendingCount > 0 && (
                                    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold text-white">
                                        {pendingCount > 9 ? "9+" : pendingCount}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="flex-1" />

                {/* Desktop search */}
                <form onSubmit={handleSearch} className="hidden sm:block">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={isAdmin ? "Search grievances…" : "Search my grievances…"}
                            className="h-8 w-44 pl-8 text-sm transition-all focus:w-52"
                        />
                    </div>
                </form>

                {/* Dark mode toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    aria-label="Toggle dark mode"
                >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>

                {/* User dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex h-8 items-center gap-1.5 rounded-full px-2 text-sm font-medium hover:bg-muted">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full ${isAdmin ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"}`}>
                                <User className="h-3.5 w-3.5" />
                            </div>
                            <span className="hidden max-w-28 truncate sm:inline">{userName}</span>
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                        {variant === "citizen" && (
                            <DropdownMenuItem asChild>
                                <Link href="/profile" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <form action={signOut}>
                            <DropdownMenuItem asChild>
                                <button type="submit" className="flex w-full items-center gap-2 text-destructive">
                                    <LogOut className="h-4 w-4" />
                                    Sign out
                                </button>
                            </DropdownMenuItem>
                        </form>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile hamburger */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-8 w-8 text-muted-foreground"
                    onClick={() => setMobileOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </header>

            {/* Mobile nav panel */}
            {mobileOpen && (
                <div className="fixed inset-x-0 top-14 z-20 border-b bg-background shadow-lg md:hidden">
                    {/* Mobile search */}
                    <div className="border-b px-4 py-3">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={isAdmin ? "Search grievances…" : "Search my grievances…"}
                                    className="h-9 pl-8 text-sm"
                                />
                            </div>
                            <Button type="submit" size="sm" className="h-9 px-4">
                                Search
                            </Button>
                        </form>
                    </div>

                    {/* Mobile nav items */}
                    <nav className="p-2 pb-3">
                        {navItems.map((item) => {
                            const active = isActive(item.href)
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${active
                                        ? isAdmin
                                            ? "bg-amber-50 text-amber-700"
                                            : "bg-primary/8 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        }`}
                                >
                                    <item.icon className="h-4 w-4 shrink-0" />
                                    {item.label}
                                    {item.href === "/notifications" && notifCount > 0 && (
                                        <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                                            {notifCount > 9 ? "9+" : notifCount}
                                        </span>
                                    )}
                                    {item.href === "/manage-grievances" && pendingCount > 0 && (
                                        <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-semibold text-white">
                                            {pendingCount > 9 ? "9+" : pendingCount}
                                        </span>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            )}
        </>
    )
}
