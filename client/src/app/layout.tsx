import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import "./globals.css"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "NishchayJyot – Challan Grievance Portal",
    template: "%s | NishchayJyot",
  },
  description:
    "NishchayJyot is a citizen grievance redressal portal for traffic challan disputes. Lodge, track, and resolve your challan grievances with AI assistance. Built for SSIP Hackathon 2023.",
  keywords: ["ONOC", "challan grievance", "traffic fine", "e-challan", "NishchayJyot", "SSIP"],
  icons: {
    icon: "/nj-logo.ico",
    shortcut: "/nj-logo.ico",
  },
  openGraph: {
    title: "NishchayJyot – Challan Grievance Portal",
    description: "Lodge and track traffic challan grievances with AI-powered support.",
    type: "website",
    locale: "en_IN",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
