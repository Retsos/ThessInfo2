"use client"

import { CheckCircle2, CircleMinus, Info, TriangleAlert, XCircle } from "lucide-react"
import type { MonthlyAnalysisResponse } from "./water-types"

const tooltips: Record<string, string> = {
    "Θολότητα NTU": "Η θολότητα δείχνει πόσο καθαρό είναι το νερό.",
    Χρώμα: "Το χρώμα δείχνει αν το νερό είναι οπτικά καθαρό.",
    Αργίλιο: "Το αργίλιο μπορεί να σχετίζεται με τη διαδικασία καθαρισμού.",
    Χλωριούχα: "Τα χλωριούχα δείχνουν την παρουσία αλάτων.",
    Αγωγιμότητα: "Η αγωγιμότητα δείχνει τη συγκέντρωση διαλυμένων αλάτων.",
    "Συγκέντρωση ιόντων υδρογόνου": "Το pH δείχνει αν το νερό είναι όξινο ή αλκαλικό.",
    "Υπολειμματικό χλώριο": "Δείχνει την ποσότητα χλωρίου που παραμένει μετά την απολύμανση.",
}

type Props = {
    analysis: MonthlyAnalysisResponse | null
    monthTs: string | null
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

export default function WaterInfoCard({ analysis, monthTs }: Props) {
    const measurements = analysis?.measurements ?? []
    const activeYear = getYearFromMonthTs(monthTs)

    return (
        <div className="rounded-[1.5rem] border border-sky-100 bg-white p-5 shadow-sm">
            <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white px-5 py-4 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="max-w-xl">
                        <h4 className="text-base sm:text-lg font-semibold text-[#1a535c] tracking-tight">
                            Λεπτομέρειες μήνα
                        </h4>

                        <p className="mt-1.5 text-sm leading-relaxed text-[#1a535c]/70">
                            Αναλυτική εικόνα των μετρήσεων του επιλεγμένου μήνα, με τιμές,
                            ποσοστά και ένδειξη συμμόρφωσης για κάθε παράμετρο.
                        </p>
                    </div>

                    {activeYear && (
                        <div className="flex shrink-0 self-start items-center sm:self-auto">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-sky-800 ring-1 ring-sky-200 shadow-sm backdrop-blur">
                                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                                {formatMonthTs(monthTs)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {!measurements.length ? (
                <p className="mt-4 text-sm text-[#1a535c]/75">
                    Δεν υπάρχουν μετρήσεις για αυτόν τον μήνα.
                </p>
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
