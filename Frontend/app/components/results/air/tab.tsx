"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Wind } from "lucide-react"
import AirLatestCard from "./latest-card"
import AirYearlyChart from "./yearly-chart"
import AirMonthlyStackedBar from "./monthly-stacked-bar"
import AirMonthlyComplianceChart from "./monthly-compliance-chart"
import type { AirMonthConcentrations, AirResultsData } from "./air-types"

type Props = {
    regionLabel: string
    data: AirResultsData | null
}

const AIR_EXPLANATIONS: Array<{
    key: string
    label: string
    unit: string
    description: string
}> = [
    {
        key: "no2_conc",
        label: "NO2 (Διοξείδιο του αζώτου)",
        unit: "μg/m³",
        description: "Ρύπος από κυκλοφορία και καύσεις, ερεθιστικός για το αναπνευστικό.",
    },
    {
        key: "o3_conc",
        label: "O3 (Όζον)",
        unit: "μg/m³",
        description: "Δευτερογενής ρύπος που σχηματίζεται στην ατμόσφαιρα.",
    },
    {
        key: "so2_conc",
        label: "SO2 (Διοξείδιο του θείου)",
        unit: "μg/m³",
        description: "Σχετίζεται με καύση καυσίμων που περιέχουν θείο.",
    },
    {
        key: "no_conc",
        label: "NO (Μονοξείδιο του αζώτου)",
        unit: "μg/m³",
        description: "Πρόδρομος ρύπος για άλλα οξειδωτικά στην ατμόσφαιρα.",
    },
    {
        key: "co_conc",
        label: "CO (Μονοξείδιο του άνθρακα)",
        unit: "mg/m³",
        description: "Προέρχεται από ατελή καύση. Στο backend μετατρέπεται σε mg/m³.",
    },
]

export default function AirTab({ regionLabel, data }: Props) {
    const sortedMonths = useMemo(
        () =>
            [...(data?.months ?? [])].sort((a, b) =>
                a.year !== b.year ? a.year - b.year : a.month - b.month
            ),
        [data?.months]
    )

    const [selectedMonthKey, setSelectedMonthKey] = useState(data?.latestMonth.month_key ?? "")

    useEffect(() => {
        if (data?.latestMonth.month_key) {
            setSelectedMonthKey(data.latestMonth.month_key)
        }
    }, [data?.latestMonth.month_key])

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

    const selectedIndex = sortedMonths.findIndex((m) => m.month_key === selectedMonthKey)
    const safeIndex = selectedIndex >= 0 ? selectedIndex : sortedMonths.length - 1
    const selectedMonth: AirMonthConcentrations = sortedMonths[safeIndex]
    const hasPrev = safeIndex > 0
    const hasNext = safeIndex < sortedMonths.length - 1
    const monthAqiScore = selectedMonth.aqi_score
    const monthAqiLabel = selectedMonth.aqi_label || "No data"

    return (
        <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-cyan-100 bg-cyan-50/60 p-6">
                <h3 className="text-2xl font-semibold text-[#1a535c] ">Ποιότητα Αέρα - {regionLabel}</h3>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-[#1a535c]/70">Επιλεγμένο έτος</p>
                        <p className="mt-2 text-3xl font-semibold text-cyan-700">{selectedMonth.year}</p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-[#1a535c]/70">Επιλεγμένος μήνας</p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                            <button
                                type="button"
                                onClick={() => hasPrev && setSelectedMonthKey(sortedMonths[safeIndex - 1].month_key)}
                                disabled={!hasPrev}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-200 text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Προηγούμενος μήνας"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <p className="text-center text-xl font-semibold text-[#1a535c]">
                                {selectedMonth.month_name}
                            </p>
                            <button
                                type="button"
                                onClick={() => hasNext && setSelectedMonthKey(sortedMonths[safeIndex + 1].month_key)}
                                disabled={!hasNext}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-200 text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Επόμενος μήνας"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-[#1a535c]/70">AQI μήνα</p>
                        <p className="mt-2 text-2xl font-semibold text-[#1a535c]">
                            {monthAqiLabel}
                            {typeof monthAqiScore === "number"
                                ? ` (${monthAqiScore.toFixed(1)})`
                                : ""}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-[1.5rem] border border-cyan-100 bg-white p-5 shadow-sm">
                <h4 className="text-lg font-semibold text-[#1a535c]">How Basic AQI Is Calculated</h4>
                <p className="mt-2 text-sm leading-6 text-[#1a535c]/82">
                    Για κάθε επιλεγμένο μήνα, το backend ελέγχει κάθε έγκυρη μέτρηση ρύπου σε σχέση
                    με το αντίστοιχο όριο WHO.
                </p>
                <p className="mt-2 text-sm leading-6 text-[#1a535c]/82">
                    Formula: <code>AQI = (compliant_checks / total_checks) * 100</code>. Όπου:
                    <code>compliant_checks</code> = μετρήσεις εντός ορίου και{" "}
                    <code>total_checks</code> = όλες οι έγκυρες μετρήσεις ρύπων του μήνα.
                </p>

                <div className="mt-4 overflow-x-auto rounded-xl border border-cyan-100">
                    <table className="min-w-full text-left text-sm text-[#1a535c]/88">
                        <thead className="bg-cyan-50/70 text-xs uppercase tracking-wide text-[#1a535c]/72">
                            <tr>
                                <th className="px-4 py-2">Ρύπος</th>
                                <th className="px-4 py-2">Όριο</th>
                                <th className="px-4 py-2">Τι σημαίνει</th>
                            </tr>
                        </thead>
                        <tbody>
                            {AIR_EXPLANATIONS.map((row) => (
                                <tr key={row.key} className="border-t border-cyan-100">
                                    <td className="px-4 py-2 font-medium">{row.label}</td>
                                    <td className="px-4 py-2">
                                        {typeof data.limits[row.key] === "number"
                                            ? `<= ${data.limits[row.key]} ${row.unit}`
                                            : "-"}
                                    </td>
                                    <td className="px-4 py-2">{row.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#1a535c]/82">
                    Για τον μήνα <code>{selectedMonth.month_key}</code>, το AQI βγαίνει από{" "}
                    <code>{selectedMonth.compliant_count}</code> ελέγχοι, δηλαδή{" "}
                    <code>
                        {typeof monthAqiScore === "number"
                            ? `${monthAqiScore.toFixed(1)} (${monthAqiLabel})`
                            : "χωρίς διαθέσιμο AQI"}
                    </code>
                    .
                </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <AirLatestCard data={data} month={selectedMonth} />
                <AirYearlyChart data={data} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <AirMonthlyStackedBar data={data} selectedYear={selectedMonth.year} />
                <AirMonthlyComplianceChart data={data} selectedYear={selectedMonth.year} />
            </div>
        </div>
    )
}
