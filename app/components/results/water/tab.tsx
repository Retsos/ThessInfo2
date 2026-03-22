"use client"

import { Droplets } from "lucide-react"
import { getQualityLevel } from "@/lib/services/results-utils"
import WaterConclusionChart from "./WaterConclusionChart"
import WaterInfoCard from "./WaterInfoCard"
import WaterMonthlyChart from "./WaterMonthlyChart"
import WaterYearlyChart from "./WaterYearlyChart"
import type { WaterLatestResponse, WaterYearlyResponse } from "./water-types"

type Props = {
    regionLabel: string
    latest: WaterLatestResponse | null
    yearly: WaterYearlyResponse | null
}

export default function WaterTab({ regionLabel, latest, yearly }: Props) {
    if (!latest) {
        return (
            <div className="rounded-[1.5rem] border border-sky-100 bg-sky-50/60 p-8 text-center">
                <Droplets className="mx-auto h-10 w-10 text-sky-700" />
                <h3 className="mt-4 text-xl font-semibold text-[#1a535c]">
                    Ποιότητα Νερού - {regionLabel}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#1a535c]/78">
                    Δεν υπάρχουν διαθέσιμα δεδομένα για την ποιότητα νερού αυτή τη στιγμή.
                </p>
            </div>
        )
    }

    const quality = getQualityLevel(latest.compliantCount)

    return (
        <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-sky-100 bg-sky-50/60 p-6">
                <h3 className="text-2xl font-semibold text-[#1a535c]">
                    Ποιότητα Νερού - {regionLabel}
                </h3>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-[#1a535c]/70">Συμμόρφωση</p>
                        <p className="mt-2 text-3xl font-semibold text-sky-700">
                            {quality.percentage ?? "-"}%
                        </p>
                        <p className="mt-2 text-sm text-[#1a535c]/78">{quality.tooltip}</p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-[#1a535c]/70">Τελευταία μέτρηση</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1a535c]">
                            {latest.month}/{latest.year}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-[#1a535c]/70">Κατάσταση</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1a535c]">
                            {quality.label}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <WaterInfoCard waterData={latest} />
                <WaterMonthlyChart waterData={latest} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <WaterYearlyChart yearlyData={yearly} />
                <WaterConclusionChart yearlyData={yearly} />
            </div>
        </div>
    )
}