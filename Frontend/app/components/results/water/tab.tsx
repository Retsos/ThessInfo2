"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Droplets } from "lucide-react"
import { getQualityLevel } from "@/lib/services/results-utils"
import WaterConclusionChart from "./WaterConclusionChart"
import WaterInfoCard from "./WaterInfoCard"
import WaterMonthlyChart from "./WaterMonthlyChart"
import WaterWqiInfoModal from "./WaterWqiInfoModal"
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
    const [isWqiModalOpen, setIsWqiModalOpen] = useState(false)

    useEffect(() => {
        setSelectedMonthIndex(getLatestIndex(months, latestMonthTs))
    }, [months, latestMonthTs])

    useEffect(() => {
        if (!isWqiModalOpen) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [isWqiModalOpen])

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

                <div className="mx-auto mt-5 w-full max-w-2xl rounded-2xl border border-[#cfe9ea] bg-[#fbffff] px-4 py-4 shadow-[0_18px_45px_rgba(29,170,173,0.14)]">
                    <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:text-left">
                        <button
                            type="button"
                            onClick={() => setSelectedMonthIndex((prev) => Math.max(0, prev - 1))}
                            disabled={!canGoPrev}
                            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#cfe9ea] bg-white text-[#1daaad] shadow-sm transition hover:border-[#1daaad] hover:bg-[#eefafa] disabled:cursor-not-allowed disabled:opacity-35"
                            aria-label="Προηγούμενος μήνας"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#1a535c]">
                                Αλλάζεις τον επιλεγμένο μήνα
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[#1a535c]/72">
                                Τα arrows ενημερώνουν τα cards και το πρώτο διάγραμμα με τα
                                δεδομένα του νέου μήνα.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setSelectedMonthIndex((prev) => Math.min(months.length - 1, prev + 1))
                            }
                            disabled={!canGoNext}
                            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#cfe9ea] bg-white text-[#1daaad] shadow-sm transition hover:border-[#1daaad] hover:bg-[#eefafa] disabled:cursor-not-allowed disabled:opacity-35"
                            aria-label="Επόμενος μήνας"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex justify-center sm:justify-start">
                    <button
                        type="button"
                        onClick={() => setIsWqiModalOpen(true)}
                        className="inline-flex cursor-pointer items-center rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-sky-800 shadow-sm transition hover:border-sky-300 hover:bg-sky-50"
                    >
                        Πώς υπολογίζεται το WQI;
                    </button>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <WaterInfoCard analysis={selectedAnalysis} monthTs={selectedMonthTs} />
                <WaterMonthlyChart year={selectedYear} entries={selectedMonthlyWqi} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <WaterYearlyChart overallByYear={water.overallWqiByYear} />
                <WaterConclusionChart stats={selectedStats} year={selectedYear} />
            </div>
            <WaterWqiInfoModal
                open={isWqiModalOpen}
                onClose={() => setIsWqiModalOpen(false)}
                rules={WQI_RULES}
                selectedYear={selectedYear}
                yearMeasurements={yearMeasurements}
            />
        </div>
    )
}
