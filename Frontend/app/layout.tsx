import type { Metadata } from 'next'
import { Geist, Geist_Mono } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "./components/navbar"
import { cn } from "@/lib/utils"
import "./globals.css"
import { Footer } from "./components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"

export const metadata: Metadata = {
  title: {
    template: '%s | ThessInfo',
    default: 'ThessInfo - Περιβαλλοντικά Δεδομένα',
  },
  description: 'Πλατφόρμα παρακολούθησης των περιβαλλοντικών δεδομένων της Θεσσαλονίκης',
}

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="el"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        geist.variable,
        fontMono.variable
      )}
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        <ThemeProvider>
          <TooltipProvider>
            <ScrollToTop />
            <Navbar />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}