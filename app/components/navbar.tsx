"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

const navItems = [
    { href: "/", label: "Αρχική" },
    { href: "/about", label: "Σχετικά" },
    { href: "/services", label: "Υπηρεσίες" },
    { href: "/contact", label: "Επικοινωνία" },
]

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-teal-100/80 bg-white/80 backdrop-blur-md">
            <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
                {/* Mobile menu button */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Άνοιγμα μενού"
                                    className="rounded-full text-teal-900 hover:bg-teal-50"
                                />
                            }
                        >
                            <Menu className="h-5 w-5" />
                        </SheetTrigger>

                        <SheetContent
                            side="left"
                            className="w-[85vw] max-w-[320px] border-r border-teal-100 bg-gradient-to-b from-white via-teal-50/60 to-sky-50/70 px-0"                        >
                            <SheetTitle className="sr-only">Μενού πλοήγησης</SheetTitle>

                            <div className="flex h-full flex-col">
                                <div className="border-b border-emerald-100 px-6 pb-6 pt-8 text-center">
                                    <Link
                                        href="/"
                                        className="inline-block text-2xl font-semibold tracking-tight text-emerald-950"
                                    >
                                        ThessInfo
                                    </Link>
                                </div>

                                <nav className="flex flex-1 flex-col justify-center px-5 py-6">
                                    <div className="flex flex-col gap-3">
                                        {navItems.map((item) => (
                                            <SheetClose
                                                key={item.href}
                                                nativeButton={false}
                                                render={
                                                    <Link
                                                        href={item.href}
                                                        className="flex min-h-12 items-center justify-center rounded-2xl border border-transparent bg-white/70 px-4 py-3 text-center text-base font-medium text-emerald-950 shadow-sm transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-100/80 hover:shadow-md active:scale-[0.98]"
                                                    />
                                                }
                                            >
                                                {item.label}
                                            </SheetClose>
                                        ))}
                                    </div>
                                </nav>

                                <div className="border-t border-emerald-100 px-6 py-5 text-center">
                                    <p className="text-xs tracking-wide text-emerald-700/70">
                                        THESSINFO
                                    </p>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Mobile centered title */}
                <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight text-teal-950"
                    >
                        ThessInfo
                    </Link>
                </div>

                {/* Desktop title */}
                <div className="hidden md:block">
                    <Link
                        href="/"
                        className="text-xl font-semibold tracking-tight text-emerald-950"
                    >
                        ThessInfo
                    </Link>
                </div>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-6 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium text-slate-700 transition-colors hover:text-teal-700"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Right spacer for mobile title centering */}
                <div className="h-9 w-9 md:hidden" />
            </div>
        </header>
    )
}