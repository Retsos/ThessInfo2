"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Wind } from "lucide-react"
import AirAqiInfoModal from "./AirAqiInfoModal"
import AirLatestCard from "./latest-card"
import AirMonthlyComplianceChart from "./monthly-compliance-chart"
import AirMonthlyStackedBar from "./monthly-stacked-bar"
import AirYearlyChart from "./yearly-chart"
import type { AirMonthConcentrations, AirResultsData } from "./air-types"

type Props = {
    regionLabel: string
    data: AirResultsData | null
}

function parseCompliance(value: string | null | undefined) {
    if (!value) {
        return {
            compliant: null as number | null,
            total: null as number | null,
            percentage: null as number | null,
        }
    }

    const normalized = value.includes(" of ") ? value : value.replace("/", " of ")
    const parts = normalized.split(" of ")
    if (parts.length !== 2) {
        return {
            compliant: null,
            total: null,
            percentage: null,
        }
    }

    const compliant = Number(parts[0])
    const total = Number(parts[1])

    if (!Number.isFinite(compliant) || !Number.isFinite(total) || total <= 0) {
        return {
            compliant: null,
            total: null,
            percentage: null,
        }
    }

    return {
        compliant,
        total,
        percentage: Number(((compliant / total) * 100).toFixed(1)),
    }
}

function getAqiSummary(score: number | null) {
    if (typeof score !== "number") {
        return {
            percentage: null as number | null,
            label: "Χωρίς αξιολόγηση",
            helper: "Δεν υπάρχουν αρκετές μετρήσεις για να βγει AQI.",
        }
    }

    if (score <= 50) {
        return {
            percentage: Number(score.toFixed(1)),
            label: "Good",
            helper: "Ο χειρότερος ρύπος του μήνα έμεινε σε χαμηλά επίπεδα.",
        }
    }

    if (score <= 100) {
        return {
            percentage: Number(score.toFixed(1)),
            label: "Moderate",
            helper: "Η εικόνα είναι οριακή αλλά όχι πάνω από το limit.",
        }
    }

    if (score <= 150) {
        return {
            percentage: Number(score.toFixed(1)),
            label: "Unhealthy for Sensitive Groups",
            helper: "Κάποιος ρύπος έχει περάσει το όριο και επηρεάζει πιο ευαίσθητες ομάδες.",
        }
    }

    if (score <= 200) {
        return {
            percentage: Number(score.toFixed(1)),
            label: "Unhealthy",
            helper: "Ο χειρότερος ρύπος είναι αρκετά πάνω από το όριο.",
        }
    }

    if (score <= 300) {
        return {
            percentage: Number(score.toFixed(1)),
            label: "Very Unhealthy",
            helper: "Η ατμοσφαιρική επιβάρυνση είναι πολύ υψηλή.",
        }
    }

    return {
        percentage: Number(score.toFixed(1)),
        label: "Hazardous",
        helper: "Οι συγκεντρώσεις είναι εξαιρετικά υψηλές.",
    }
}

export default function AirTab({ regionLabel, data }: Props) {
    const sortedMonths = useMemo(
        () =>
            [...(data?.months ?? [])].sort((a, b) =>
                a.year !== b.year ? a.year - b.year : a.month - b.month
            ),
        [data?.months]
    )

    const [selectedMonthKey, setSelectedMonthKey] = useState("")
    const [isAqiModalOpen, setIsAqiModalOpen] = useState(false)

    useEffect(() => {
        if (!isAqiModalOpen) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [isAqiModalOpen])

    if (!data || !sortedMonths.length) {
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

    const effectiveMonthKey =
        selectedMonthKey && sortedMonths.some((month) => month.month_key === selectedMonthKey)
            ? selectedMonthKey
            : data.latestMonth.month_key

    const selectedIndex = sortedMonths.findIndex((month) => month.month_key === effectiveMonthKey)
    const safeIndex = selectedIndex >= 0 ? selectedIndex : sortedMonths.length - 1
    const selectedMonth: AirMonthConcentrations = sortedMonths[safeIndex]
    const hasPrev = safeIndex > 0
    const hasNext = safeIndex < sortedMonths.length - 1
    const compliance = parseCompliance(selectedMonth.compliant_count)
    const aqiSummary = getAqiSummary(selectedMonth.aqi_score)
    const selectedYearlyIndex =
        data.yearlyIndex.find((entry) => entry.year === selectedMonth.year) ?? null

    return (
        <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-cyan-100 bg-cyan-50/60 p-6">
                <h3 className="text-2xl font-semibold text-[#1a535c]">
                    Ποιότητα Αέρα - {regionLabel}
                </h3>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-[#1a535c]/70">Συμμόρφωση μήνα</p>
                        <p className="mt-2 text-3xl font-semibold text-cyan-700">
                            {compliance.percentage != null ? `${compliance.percentage}%` : "-"}
                        </p>
                        <p className="mt-2 text-sm text-[#1a535c]/78">
                            {compliance.compliant != null && compliance.total != null
                                ? `${compliance.compliant} από ${compliance.total} έγκυρους ελέγχους`
                                : "Δεν υπάρχουν αρκετά checks για ασφαλές ποσοστό."}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-[#1a535c]/70">Επιλεγμένος μήνας</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1a535c]">
                            {selectedMonth.month_name} {selectedMonth.year}
                        </p>
                        <span className="mt-2 inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-800 ring-1 ring-cyan-200">
                            ΕΤΟΣ {selectedMonth.year}
                        </span>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-[#1a535c]/70">AQI μήνα</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1a535c]">
                            {aqiSummary.percentage != null ? aqiSummary.percentage : "-"}
                        </p>
                        <p className="mt-2 text-sm font-medium text-cyan-800">
                            {selectedMonth.aqi_label || "Χωρίς δεδομένα"}
                        </p>
                        <p className="mt-1 text-sm text-[#1a535c]/78">{aqiSummary.helper}</p>
                    </div>
                </div>

                <div className="mx-auto mt-5 w-full max-w-2xl rounded-2xl border border-[#cceef2] bg-[#fbfeff] px-4 py-4 shadow-[0_18px_45px_rgba(41,146,162,0.14)]">
                    <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:text-left">
                        <button
                            type="button"
                            onClick={() => hasPrev && setSelectedMonthKey(sortedMonths[safeIndex - 1].month_key)}
                            disabled={!hasPrev}
                            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#cceef2] bg-white text-[#2992a2] shadow-sm transition hover:border-[#2992a2] hover:bg-[#eefbfd] disabled:cursor-not-allowed disabled:opacity-35"
                            aria-label="Προηγούμενος μήνας"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#1a535c]">
                                Αλλάζεις τον επιλεγμένο μήνα
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[#1a535c]/72">
                                Τα arrows ενημερώνουν τις κάρτες και τα διαγράμματα με τις μετρήσεις
                                του νέου μήνα και του αντίστοιχου έτους.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => hasNext && setSelectedMonthKey(sortedMonths[safeIndex + 1].month_key)}
                            disabled={!hasNext}
                            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#cceef2] bg-white text-[#2992a2] shadow-sm transition hover:border-[#2992a2] hover:bg-[#eefbfd] disabled:cursor-not-allowed disabled:opacity-35"
                            aria-label="Επόμενος μήνας"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex justify-center sm:justify-start">
                    <button
                        type="button"
                        onClick={() => setIsAqiModalOpen(true)}
                        className="inline-flex cursor-pointer items-center rounded-full border border-cyan-200 bg-white px-4 py-2 text-sm font-medium text-cyan-800 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50"
                    >
                        Πώς υπολογίζεται το AQI;
                    </button>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <AirLatestCard data={data} month={selectedMonth} />
                <AirMonthlyComplianceChart data={data} selectedYear={selectedMonth.year} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <AirYearlyChart data={data} />
                <AirMonthlyStackedBar data={data} selectedYear={selectedMonth.year} />
            </div>

            <AirAqiInfoModal
                open={isAqiModalOpen}
                onClose={() => setIsAqiModalOpen(false)}
                selectedMonthLabel={`${selectedMonth.month_name} ${selectedMonth.year}`}
                selectedMonthKey={selectedMonth.month_key}
                monthAqiScore={selectedMonth.aqi_score}
                monthAqiLabel={selectedMonth.aqi_label || "No data"}
                monthPollutantIndices={selectedMonth.pollutant_indices}
                monthDominantPollutant={selectedMonth.dominant_pollutant}
                yearAqiScore={selectedYearlyIndex?.aqi_score ?? null}
                yearAqiLabel={selectedYearlyIndex?.aqi_label ?? null}
                yearDominantPollutant={selectedYearlyIndex?.dominant_pollutant ?? null}
            />
        </div>
    )
}
