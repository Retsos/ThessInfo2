import Link from "next/link"
import { Droplets, Recycle, Waves, Wind } from "lucide-react"

const mainLinks = [
    { href: "/", label: "Αρχική" },
    { href: "/about", label: "Σχετικά" },
    { href: "/services", label: "Υπηρεσίες" },
    { href: "/contact", label: "Επικοινωνία" },
]

const topicLinks = [
    { href: "/ArrayMapSection/1/Water", label: "Ποιότητα Νερού", icon: Droplets },
    { href: "/ArrayMapSection/1/Air", label: "Ποιότητα Αέρα", icon: Wind },
    { href: "/ArrayMapSection/1/Recycle", label: "Ανακύκλωση", icon: Recycle },
]

export function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="relative overflow-hidden border-t border-[#cfe9ea] bg-[linear-gradient(180deg,#f5fcfc_0%,#edf9f9_45%,#e8f6f7_100%)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#2c999b_0%,#1daaad_50%,#006264_100%)]" />

            <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
                <div className="grid gap-10 md:grid-cols-[1.2fr_0.9fr_1fr]">
                    <div className="max-w-md">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-sm font-semibold text-[#1daaad] shadow-sm">
                            <Waves className="h-4 w-4" />
                            ThessInfo
                        </div>

                        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#1a535c]">
                            Περιβαλλοντική πληροφόρηση για τη Θεσσαλονίκη
                        </h3>

                        <p className="mt-4 text-sm leading-7 text-[#1a535c]/80">
                            Καθαρή παρουσίαση δεδομένων για αέρα, νερό και ανακύκλωση, με
                            τοπικό προσανατολισμό και πιο ήρεμη αισθητική. 
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1daaad]">
                            Πλοήγηση
                        </h4>

                        <nav className="mt-4 flex flex-col gap-3">
                            {mainLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm font-medium text-[#1a535c]/85 transition-colors hover:text-[#006264]"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1daaad]">
                            Θεματικές
                        </h4>

                        <div className="mt-4 flex flex-col gap-3">
                            {topicLinks.map((item) => {
                                const Icon = item.icon

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="group inline-flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-medium text-[#1a535c] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#bfe5e6] hover:bg-white"
                                    >
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8fbfb] text-[#1daaad]">
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        <span className="transition-colors group-hover:text-[#006264]">
                                            {item.label}
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-[#d6ecec] pt-5">
                    <div className="flex flex-col gap-3 text-sm text-[#1a535c]/70 md:flex-row md:items-center md:justify-between">
                        <p>© {year} ThessInfo. Με επίκεντρο τη Θεσσαλονίκη και την ουσία.</p>

                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                href="/about"
                                className="transition-colors hover:text-[#006264]"
                            >
                                Σχετικά
                            </Link>
                            <Link
                                href="/contact"
                                className="transition-colors hover:text-[#006264]"
                            >
                                Επικοινωνία
                            </Link>
                            <Link
                                href="/LearnMore"
                                className="transition-colors hover:text-[#006264]"
                            >
                                Μάθε περισσότερα
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}