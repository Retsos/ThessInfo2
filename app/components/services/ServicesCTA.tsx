import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function ServicesCTA() {
    return (
        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-24">
            <div className="overflow-hidden rounded-[1.8rem] bg-[linear-gradient(135deg,#2c999b_0%,#1daaad_45%,#006264_100%)] p-[1px] shadow-[0_24px_60px_rgba(29,170,173,0.22)]">
                <div className="flex flex-col gap-6 rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-6 backdrop-blur-sm md:flex-row md:items-center md:justify-between md:p-8">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/85">
                            Επόμενο στάδιο
                        </p>

                        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                            Από εδώ περνάμε στη σελίδα αποτελεσμάτων ανά περιοχή
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-white/82">
                            Το `services` είναι η είσοδος. Το βάρος μετά πέφτει στο `results`
                            route, όπου θα μπουν summaries, tabs και αργότερα charts.
                        </p>
                    </div>

                    <Link
                        href="/services/results?region=%CE%9A%CE%AD%CE%BD%CF%84%CF%81%CE%BF%20%CF%80%CF%8C%CE%BB%CE%B7%CF%82"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#006264] shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:bg-[#f1fafa]"
                    >
                        Δες demo αποτελεσμάτων
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    )
}