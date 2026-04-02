"use client"

import { useEffect, useMemo, useState } from "react"
import { Droplets } from "lucide-react"
import { getQualityLevel } from "@/lib/services/results-utils"
import WaterConclusionChart from "./WaterConclusionChart"
import WaterInfoCard from "./WaterInfoCard"
import WaterMonthlyChart from "./WaterMonthlyChart"
import WaterYearlyChart from "./WaterYearlyChart"
import type { WaterTabData } from "./water-types"

type Props = {
    regionLabel: string
    water: WaterTabData | null
}

const WQI_RULES = [
    { parameter: "pH", si: 8.5, ideal: 7.0, weight: 0.22 },
    { parameter: "Turbidity", si: 1.0, ideal: 0.0, weight: 0.15 },
    { parameter: "Chlorides", si: 250.0, ideal: 0.0, weight: 0.1 },
    { parameter: "Conductivity", si: 2500.0, ideal: 0.0, weight: 0.08 },
    { parameter: "Aluminum", si: 200.0, ideal: 0.0, weight: 0.12 },
    { parameter: "Residual chlorine", si: 0.5, ideal: 0.0, weight: 0.2 },
]

function getLatestIndex(months: string[], latest: string | null): number {
    if (!months.length) return 0
    if (!latest) return months.length - 1

    const idx = months.indexOf(latest)
    return idx >= 0 ? idx : months.length - 1
}

function monthTsToYear(monthTs: string | null): string | null {
    if (!monthTs) return null
    const y = monthTs.slice(0, 4)
    return /^\d{4}$/.test(y) ? y : null
}

function formatMonthTs(monthTs: string | null): string {
    if (!monthTs) return "-"
    const [yearStr, monthStr] = monthTs.split("-")
    const year = Number(yearStr)
    const month = Number(monthStr)
    if (!Number.isFinite(year) || !Number.isFinite(month)) return monthTs

    return new Intl.DateTimeFormat("el-GR", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, 1)))
}

export default function WaterTab({ regionLabel, water }: Props) {
    const months = water?.availableMonths.available_months ?? []
    const latestMonthTs = water?.availableMonths.latest ?? null

    const [selectedMonthIndex, setSelectedMonthIndex] = useState(() =>
        getLatestIndex(months, latestMonthTs)
    )

    useEffect(() => {
        setSelectedMonthIndex(getLatestIndex(months, latestMonthTs))
    }, [months, latestMonthTs])

    if (!water || !months.length) {
        return (
            <div className="rounded-[1.5rem] border border-sky-100 bg-sky-50/60 p-8 text-center">
                <Droplets className="mx-auto h-10 w-10 text-sky-700" />
                <h3 className="mt-4 text-xl font-semibold text-[#1a535c]">
                    Ποιότητα Νερού - {regionLabel}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#1a535c]/78">
                    Δεν υπάρχουν διαθέσιμα δεδομένα ποιότητας νερού για αυτή την περιοχή.
                </p>
            </div>
        )
    }

    const safeIndex = Math.max(0, Math.min(selectedMonthIndex, months.length - 1))
    const selectedMonthTs = months[safeIndex] ?? null
    const selectedYear = monthTsToYear(selectedMonthTs)

    const selectedAnalysis = selectedMonthTs
        ? water.analysesByMonth[selectedMonthTs] ?? null
        : null

    const selectedStats = selectedYear ? water.statsByYear[selectedYear] ?? null : null
    const selectedMonthlyWqi = selectedYear ? water.monthlyWqiByYear[selectedYear] ?? [] : []

    const complianceText = useMemo(() => {
        if (!selectedStats || selectedStats.recordedMeasurements <= 0) return null
        return `${selectedStats.compliance} of ${selectedStats.recordedMeasurements}`
    }, [selectedStats])

    const quality = getQualityLevel(complianceText)
    const overallWqi = selectedYear ? water.overallWqiByYear[selectedYear] ?? null : null
    const yearMeasurements = selectedYear
        ? months
              .filter((month) => month.startsWith(selectedYear))
              .reduce((total, month) => {
                  const monthData = water.analysesByMonth[month]?.measurements ?? []
                  return total + monthData.length
              }, 0)
        : 0

    const canGoPrev = safeIndex > 0
    const canGoNext = safeIndex < months.length - 1

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
                        <p className="text-sm font-medium text-[#1a535c]/70">Επιλεγμένος μήνας</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1a535c]">
                            {formatMonthTs(selectedMonthTs)}
                        </p>
                        {selectedYear ? (
                            <span className="mt-2 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold tracking-wide text-sky-800 ring-1 ring-sky-200">
                                ΕΤΟΣ {selectedYear}
                            </span>
                        ) : null}
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-[#1a535c]/70">Συνολικό WQI</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1a535c]">
                            {overallWqi?.overall_wqi?.score?.toFixed(2) ?? "-"}
                        </p>
                        <p className="mt-2 text-sm text-[#1a535c]/78">
                            {overallWqi?.overall_wqi?.rating ?? "Χωρίς αξιολόγηση"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-[1.5rem] border border-sky-100 bg-white p-5 shadow-sm">
                <h4 className="text-lg font-semibold text-[#1a535c]">How WQI is calculated</h4>
                <p className="mt-2 text-sm leading-6 text-[#1a535c]/82">
                    Backend formula in <code>calculate_wqi</code>:{" "}
                    <code>qi = 100 * ((value - ideal) / (Si - ideal))</code>, then{" "}
                    <code>WQI = sum(Wi * qi) / sum(Wi)</code>.
                </p>
                <p className="mt-2 text-sm leading-6 text-[#1a535c]/82">
                    Values with missing measurements are skipped. Parameter matching is done by name
                    contains logic (for example <code>pH</code>, <code>chloride</code>,{" "}
                    <code>conductivity</code>).
                </p>

                <div className="mt-4 overflow-x-auto rounded-xl border border-sky-100">
                    <table className="min-w-full text-left text-sm text-[#1a535c]/88">
                        <thead className="bg-sky-50/70 text-xs uppercase tracking-wide text-[#1a535c]/72">
                            <tr>
                                <th className="px-4 py-2">Parameter group</th>
                                <th className="px-4 py-2">Si</th>
                                <th className="px-4 py-2">Ideal</th>
                                <th className="px-4 py-2">Weight (Wi)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {WQI_RULES.map((rule) => (
                                <tr key={rule.parameter} className="border-t border-sky-100">
                                    <td className="px-4 py-2 font-medium">{rule.parameter}</td>
                                    <td className="px-4 py-2">{rule.si}</td>
                                    <td className="px-4 py-2">{rule.ideal}</td>
                                    <td className="px-4 py-2">{rule.weight}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#1a535c]/82">
                    Rating thresholds from backend:{" "}
                    <code>{`<=25 Excellent, <=50 Good, <=75 Poor, <=100 Very Poor, >100 Unsuitable`}</code>.
                </p>
                <p className="mt-2 text-sm leading-6 text-[#1a535c]/82">
                    {selectedYear
                        ? `For the selected year ${selectedYear}, the overall WQI is computed from all measurements in that year (${yearMeasurements} measurement rows loaded in the frontend).`
                        : "Select a month/year to see year-specific WQI context."}
                </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <WaterInfoCard
                    analysis={selectedAnalysis}
                    monthTs={selectedMonthTs}
                    canGoPrev={canGoPrev}
                    canGoNext={canGoNext}
                    onPrev={() => setSelectedMonthIndex((prev) => Math.max(0, prev - 1))}
                    onNext={() =>
                        setSelectedMonthIndex((prev) => Math.min(months.length - 1, prev + 1))
                    }
                />
                <WaterMonthlyChart year={selectedYear} entries={selectedMonthlyWqi} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <WaterYearlyChart overallByYear={water.overallWqiByYear} />
                <WaterConclusionChart stats={selectedStats} year={selectedYear} />
            </div>
        </div>
    )
}
