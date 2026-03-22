import { Recycle } from "lucide-react"
import { getLatestRecycleYear } from "@/lib/services/results-utils"

type Props = {
    regionLabel: string
    ota: any
    perPerson: any
    usableGeneral: any
}

export default function RecycleTab({
    regionLabel,
    ota,
    perPerson,
    usableGeneral,
}: Props) {
    if (!ota) {
        return (
            <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/60 p-8 text-center">
                <Recycle className="mx-auto h-10 w-10 text-emerald-700" />
                <h3 className="mt-4 text-xl font-semibold text-[#1a535c]">
                    Ανακύκλωση - {regionLabel}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#1a535c]/78">
                    Δεν υπάρχουν διαθέσιμα δεδομένα ανακύκλωσης αυτή τη στιγμή.
                </p>
            </div>
        )
    }

    const latestYear = getLatestRecycleYear(ota)

    return (
        <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/60 p-6">
                <h3 className="text-2xl font-semibold text-[#1a535c]">
                    Ανακύκλωση - {regionLabel}
                </h3>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-[#1a535c]/70">Τελευταίο έτος</p>
                        <p className="mt-2 text-3xl font-semibold text-emerald-700">
                            {latestYear ?? "-"}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-[#1a535c]/70">OTA δεδομένα</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1a535c]">
                            {ota ? "Διαθέσιμα" : "Όχι"}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-[#1a535c]/70">Per person</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1a535c]">
                            {perPerson ? "Διαθέσιμα" : "Όχι"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-[#1a535c]">
                    Placeholder για charts ανακύκλωσης
                </h4>
                <p className="mt-2 text-sm leading-6 text-[#1a535c]/78">
                    Εδώ θα μπουν αργότερα recycle yearly, per person και comparative charts.
                </p>
            </div>
        </div>
    )
}