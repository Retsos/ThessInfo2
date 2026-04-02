"use client"

import { Wind } from "lucide-react"
import { getLatestAirMeasurement } from "@/lib/services/results-utils"
import AirLatestCard from "./latest-card"
import AirYearlyChart from "./yearly-chart"
import AirMonthlyStackedBar from "./monthly-stacked-bar"
import AirMonthlyComplianceChart from "./monthly-compliance-chart"
import type { AirDataResponse } from "./air-types"

type Props = {
    regionLabel: string
    latest: AirDataResponse | null
    yearly: AirDataResponse | null
}

export default function AirTab({ regionLabel, latest, yearly }: Props) {
    // Στον αέρα, από το παλιό app:
    // latest card + monthly charts -> χρησιμοποιούσαν AirDataYear
    // yearly line chart -> χρησιμοποιούσε AirDataLatest

    const summarySource = yearly
    const yearlyChartSource = latest

    if (!summarySource && !yearlyChartSource) {
        return (
            <div className="rounded-[1.5rem] border border-cyan-100 bg-cyan-50/60 p-8 text-center">
                <Wind className="mx-auto h-10 w-10 text-cyan-700" />
                <h3 className="mt-4 text-xl font-semibold text-[#1a535c]">
                    Ποιότητα Αέρα - {regionLabel}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#1a535c]/78">
                    Δεν υπάρχουν διαθέσιμα δεδομένα για την ποιότητα αέρα αυτή τη στιγμή.
                </p>
            </div>
        )
    }

    const latestAir = summarySource ? getLatestAirMeasurement(summarySource) : null

    return (
        <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-cyan-100 bg-cyan-50/60 p-6">
                <h3 className="text-2xl font-semibold text-[#1a535c] ">
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
                        <p className="text-sm font-medium text-[#1a535c]/70">Κατάσταση δεδομένων</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1a535c]">
                            {summarySource || yearlyChartSource ? "Διαθέσιμα" : "Όχι"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <AirLatestCard airData={summarySource} />
                <AirYearlyChart yearlyData={yearlyChartSource} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <AirMonthlyStackedBar airData={summarySource} />
                <AirMonthlyComplianceChart airData={summarySource} />
            </div>
        </div>
    )
}