"use client"

import { useMemo, useState } from "react"
import { Recycle } from "lucide-react"
import type { RecycleResultsData } from "./recycle-types"
import RecycleSummaryCards from "./summary"
import MonthlyTrendChart from "./MonthlyTrendChart"
import EfficiencyChart from "./EfficiencyChart"
import WasteStackedChart from "./WasteStackedChart"

type Props = {
    regionLabel: string
    data: RecycleResultsData | null
}

export default function RecycleTab({ regionLabel, data }: Props) {
    const years = useMemo(() => data?.years ?? [], [data])
    const latestYear = useMemo(
        () => (years.length ? Math.max(...years) : null),
        [years]
    )

    const [selectedYear, setSelectedYear] = useState<number | null>(null)

    // Use selected year, or fall back to latest
    const activeYear = selectedYear ?? latestYear

    if (!data || !activeYear) {
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

    const yearKey = String(activeYear)
    const monthlyData = data.monthly[yearKey] ?? []
    const efficiencyData = data.efficiency[yearKey] ?? []

    return (
        <div className="space-y-6">
            {/* ── Header + Year selector ────────────────────────────────── */}
            <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/60 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h3 className="text-2xl font-semibold text-[#1a535c]">
                            Ανακύκλωση — {regionLabel}
                        </h3>
                        <p className="mt-1 text-sm text-[#1a535c]/65">
                            Temporal analysis & efficiency metrics
                        </p>
                    </div>

                    {/* Year pills */}
                    {years.length > 1 && (
                        <div className="flex gap-2">
                            {years.map((year) => {
                                const isActive = year === activeYear
                                return (
                                    <button
                                        key={year}
                                        type="button"
                                        onClick={() => setSelectedYear(year)}
                                        className={[
                                            "inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                                            isActive
                                                ? "border-emerald-300 bg-emerald-100 text-emerald-800 shadow-sm"
                                                : "border-emerald-200 bg-white text-emerald-700/70 hover:bg-emerald-50",
                                        ].join(" ")}
                                    >
                                        {year}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Summary cards ─────────────────────────────────────────── */}
            <RecycleSummaryCards
                summary={data.summary}
                selectedYear={activeYear}
            />

            {/* ── Efficiency Chart (Primary) ─────────────────────── */}
            <div className="grid gap-6">
                <EfficiencyChart
                    efficiency={efficiencyData}
                    year={activeYear}
                    regionLabel={regionLabel}
                />
            </div>

            {/* ── Charts row 2: Trend + Stacked waste ─────────────── */}
            <div className="grid gap-6 xl:grid-cols-2">
                <MonthlyTrendChart 
                    monthly={data.monthly} 
                    years={years} 
                    regionLabel={regionLabel}
                />
                <WasteStackedChart
                    efficiency={efficiencyData}
                    year={activeYear}
                    regionLabel={regionLabel}
                />
            </div>
        </div>
    )
}