"use client"

import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    CircleMinus,
    Info,
    TriangleAlert,
    XCircle,
} from "lucide-react"
import type { MonthlyAnalysisResponse } from "./water-types"

const tooltips: Record<string, string> = {
    "Θολότητα NTU": "Η θολότητα δείχνει πόσο καθαρό είναι το νερό.",
    "Χρώμα": "Το χρώμα δείχνει αν το νερό είναι οπτικά καθαρό.",
    "Αργίλιο": "Το αργίλιο μπορεί να σχετίζεται με τη διαδικασία καθαρισμού.",
    "Χλωριούχα": "Τα χλωριούχα δείχνουν την παρουσία αλάτων.",
    "Αγωγιμότητα": "Η αγωγιμότητα δείχνει τη συγκέντρωση διαλυμένων αλάτων.",
    "Συγκέντρωση ιόντων υδρογόνου": "Το pH δείχνει αν το νερό είναι όξινο ή αλκαλικό.",
    "Υπολειμματικό χλώριο": "Δείχνει την ποσότητα χλωρίου που παραμένει μετά την απολύμανση.",
}

type Props = {
    analysis: MonthlyAnalysisResponse | null
    monthTs: string | null
    canGoPrev: boolean
    canGoNext: boolean
    onPrev: () => void
    onNext: () => void
}

function formatMonthTs(monthTs: string | null): string {
    if (!monthTs) return "-"

    const [yearStr, monthStr] = monthTs.split("-")
    const year = Number(yearStr)
    const month = Number(monthStr)

    if (!Number.isFinite(year) || !Number.isFinite(month)) return monthTs

    const d = new Date(Date.UTC(year, month - 1, 1))

    return new Intl.DateTimeFormat("el-GR", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(d)
}

function getYearFromMonthTs(monthTs: string | null): string | null {
    if (!monthTs) return null
    const year = monthTs.slice(0, 4)
    return /^\d{4}$/.test(year) ? year : null
}

function MeasurementStatusIcon({ status }: { status: string }) {
    const normalized = status.toLowerCase().trim()
    const isUnknown =
        normalized === "unknown" ||
        normalized === "χωρίς δεδομένα" ||
        normalized === "χωρις δεδομενα"
    const isGood =
        normalized === "good" ||
        normalized === "excellent" ||
        normalized === "καλή" ||
        normalized === "καλη"

    if (isGood) {
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-label="Συμμορφώνεται" />
    }

    if (isUnknown) {
        return <CircleMinus className="h-5 w-5 text-slate-400" aria-label="Χωρίς μέτρηση" />
    }

    if (normalized === "warning") {
        return <TriangleAlert className="h-5 w-5 text-amber-500" aria-label="Προειδοποίηση" />
    }

    return <XCircle className="h-5 w-5 text-red-600" aria-label="Μη συμμόρφωση" />
}

export default function WaterInfoCard({
    analysis,
    monthTs,
    canGoPrev,
    canGoNext,
    onPrev,
    onNext,
}: Props) {
    const measurements = analysis?.measurements ?? []
    const activeYear = getYearFromMonthTs(monthTs)

    return (
        <div className="rounded-[1.5rem] border border-sky-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-sky-50/70 px-3 py-2">
                <button
                    type="button"
                    onClick={onPrev}
                    disabled={!canGoPrev}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sky-200 bg-white text-sky-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Προηγούμενος μήνας"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="text-center">
                    <h4 className="text-center text-lg font-semibold text-[#1a535c]">
                        Λεπτομέρειες μήνα: {formatMonthTs(monthTs)}
                    </h4>
                    {activeYear ? (
                        <span className="mt-1 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold tracking-wide text-sky-700 ring-1 ring-sky-200">
                            ΕΤΟΣ {activeYear}
                        </span>
                    ) : null}
                </div>

                <button
                    type="button"
                    onClick={onNext}
                    disabled={!canGoNext}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sky-200 bg-white text-sky-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Επόμενος μήνας"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            {!measurements.length ? (
                <p className="mt-4 text-sm text-[#1a535c]/75">Δεν υπάρχουν μετρήσεις για αυτόν τον μήνα.</p>
            ) : (
                <ul className="mt-4 space-y-3">
                    {measurements.map((item, idx) => {
                        const hasValue = item.val != null
                        const pct = typeof item.pct === "number" ? `${item.pct.toFixed(1)}%` : null
                        const displayValue = hasValue ? String(item.val) : "Χωρίς δεδομένα"

                        return (
                            <li
                                key={`${item.param}-${idx}`}
                                className="flex items-start justify-between gap-4 rounded-xl bg-[#f8fcfc] px-4 py-3"
                            >
                                <div className="min-w-0 flex-1 text-sm leading-6 text-[#1a535c]">
                                    <span className="font-semibold">{item.param}</span>: {displayValue}
                                    {pct ? <span className="ml-2 text-[#1a535c]/65">({pct})</span> : null}
                                </div>

                                <div className="flex items-center gap-2">
                                    <MeasurementStatusIcon status={item.status} />

                                    <span
                                        title={tooltips[item.param] ?? "Πληροφορία παραμέτρου"}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-700"
                                    >
                                        <Info className="h-4 w-4" />
                                    </span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
