import { Wind } from "lucide-react"
import { getLatestAirMeasurement } from "@/lib/services/results-utils"

type Props = {
    regionLabel: string
    latest: any
    yearly: any
}

export default function AirTab({ regionLabel, latest, yearly }: Props) {
    if (!latest) {
        return (
            <div className="rounded-[1.5rem] border border-cyan-100 bg-cyan-50/60 p-8 text-center">
                <Wind className="mx-auto h-10 w-10 text-cyan-700" />
                <h3 className="mt-4 text-xl font-semibold text-[#1a535c]">
                    Ποιότητα Αέρα - {regionLabel}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#1a535c]/78">
                    Δεν υπάρχουν διαθέσιμα δεδομένα αέρα αυτή τη στιγμή.
                </p>
            </div>
        )
    }

    const latestAir = getLatestAirMeasurement(yearly)

    return (
        <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-cyan-100 bg-cyan-50/60 p-6">
                <h3 className="text-2xl font-semibold text-[#1a535c]">
                    Ποιότητα Αέρα - {regionLabel}
                </h3>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-[#1a535c]/70">Τελευταίο έτος</p>
                        <p className="mt-2 text-3xl font-semibold text-cyan-700">
                            {latestAir?.year ?? "-"}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-[#1a535c]/70">Τελευταίος μήνας</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1a535c]">
                            {latestAir?.month ?? "-"}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-[#1a535c]/70">Δεδομένα</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1a535c]">
                            {latest ? "Διαθέσιμα" : "Όχι"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-[#1a535c]">
                    Placeholder για charts αέρα
                </h4>
                <p className="mt-2 text-sm leading-6 text-[#1a535c]/78">
                    Εδώ θα μπουν latest cards, yearly chart και monthly compliance sections.
                </p>
            </div>
        </div>
    )
}