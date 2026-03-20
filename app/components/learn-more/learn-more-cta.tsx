import Link from "next/link"
import { ArrowRight, Mail } from "lucide-react"

export function LearnMoreCTA() {
    return (
        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-24">
            <div className="overflow-hidden rounded-[1.8rem] bg-[linear-gradient(135deg,#2c999b_0%,#1daaad_45%,#006264_100%)] p-[1px] shadow-[0_24px_60px_rgba(29,170,173,0.22)]">
                <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-6 backdrop-blur-sm md:p-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14 text-white">
                            <Mail className="h-5 w-5" />
                        </div>

                        <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                            Έχεις ακόμη απορίες;
                        </h3>

                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
                            Αν θέλεις να μάθεις περισσότερα για την πλατφόρμα, τις ενότητες ή
                            τον τρόπο οργάνωσης της πληροφορίας, μπορείς να επικοινωνήσεις μαζί μας.
                        </p>

                        <div className="mt-7">
                            <Link
                                href="/contact"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#006264] shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:bg-[#f1fafa]"
                            >
                                Επικοινωνήστε μαζί μας
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}