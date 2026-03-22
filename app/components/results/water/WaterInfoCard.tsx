"use client"

import {
    CheckCircle2,
    CircleMinus,
    Info,
    XCircle,
} from "lucide-react"
import type { WaterLatestResponse } from "./water-types"

const tooltips: Record<string, string> = {
    "Θολότητα NTU": "Η θολότητα δείχνει πόσο καθαρό είναι το νερό. Αποδεκτή τιμή: < 1.0 NTU.",
    "Χρώμα": "Το χρώμα δείχνει αν το νερό είναι οπτικά καθαρό. Όριο: ≤ 15 mg/l Pt-Co.",
    "Αργίλιο": "Το αργίλιο μπορεί να σχετίζεται με τη διαδικασία καθαρισμού. Όριο: ≤ 200 μg/l.",
    "Χλωριούχα": "Τα χλωριούχα δείχνουν την παρουσία αλάτων. Όριο: ≤ 250 mg/l.",
    "Αγωγιμότητα": "Η αγωγιμότητα δείχνει τη συγκέντρωση διαλυμένων αλάτων. Όριο: ≤ 2500 μS/cm.",
    "Συγκέντρωση ιόντων υδρογόνου": "Το pH δείχνει αν το νερό είναι όξινο ή αλκαλικό. Ιδανικό εύρος: 6.5 - 9.5.",
    "Υπολειμματικό χλώριο": "Δείχνει την ποσότητα χλωρίου που παραμένει μετά την απολύμανση. Όριο: ≥ 0.2 mg/l.",
}

type Props = {
    waterData: WaterLatestResponse
}

export default function WaterInfoCard({ waterData }: Props) {
    const analysis = waterData?.analysis ?? []

    if (!analysis.length) return null

    const month = waterData.latest_data?.[0]?.Month ?? ""
    const year = waterData.latest_data?.[0]?.Year ?? ""

    return (
        <div className="rounded-[1.5rem] border border-sky-100 bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-[#1a535c]">
                Λεπτομέρειες για: {month} {year ? `(${year})` : ""}
            </h4>

            <ul className="mt-4 space-y-3">
                {analysis.map((item, idx) => {
                    const hasValue = item.value != null
                    const limitDisplay = item.limit ?? null

                    let statusIcon = (
                        <CircleMinus className="h-5 w-5 text-slate-400" aria-label="Χωρίς μέτρηση" />
                    )

                    if (hasValue && item.is_compliant) {
                        statusIcon = (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-label="Εντός ορίου" />
                        )
                    } else if (hasValue && item.is_compliant === false) {
                        statusIcon = (
                            <XCircle className="h-5 w-5 text-red-600" aria-label="Εκτός ορίου" />
                        )
                    }

                    return (
                        <li
                            key={`${item.parameter}-${idx}`}
                            className="flex items-start justify-between gap-4 rounded-xl bg-[#f8fcfc] px-4 py-3"
                        >
                            <div className="min-w-0 flex-1 text-sm leading-6 text-[#1a535c]">
                                <span className="font-semibold">{item.parameter}</span>:{" "}
                                {hasValue ? item.value : "–"} {hasValue ? item.unit ?? "" : ""}
                                {limitDisplay && (
                                    <span className="ml-2 text-[#1a535c]/65">({String(limitDisplay)})</span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {statusIcon}

                                <span
                                    title={tooltips[item.parameter] ?? "Πληροφορία για την παράμετρο"}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-700"
                                >
                                    <Info className="h-4 w-4" />
                                </span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}