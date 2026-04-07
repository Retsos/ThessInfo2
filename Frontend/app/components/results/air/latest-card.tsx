"use client"

import { CheckCircle2, Info, XCircle } from "lucide-react"
import type { AirMonthConcentrations, AirResultsData } from "./air-types"

const PARAM_TOOLTIPS: Record<string, string> = {
    no2_conc:
        "Διοξείδιο του αζώτου (NO2): σχετίζεται κυρίως με κυκλοφορία και καύσεις, ερεθιστικό για το αναπνευστικό.",
    o3_conc:
        "Όζον (O3): σχηματίζεται από χημικές αντιδράσεις στην ατμόσφαιρα και επηρεάζει την αναπνευστική υγεία.",
    co_conc:
        "Μονοξείδιο του άνθρακα (CO): παράγεται από ατελή καύση και επηρεάζει τη μεταφορά οξυγόνου στο αίμα.",
    no_conc:
        "Μονοξείδιο του αζώτου (NO): πρόδρομος άλλων ρύπων, τοξικό σε υψηλότερες συγκεντρώσεις.",
    so2_conc:
        "Διοξείδιο του θείου (SO2): σχετίζεται με θειούχα καύσιμα και ερεθίζει το αναπνευστικό σύστημα.",
}

type Props = {
    data: AirResultsData | null
    month: AirMonthConcentrations
}

function formatUnit(param: string, value: number) {
    const unit = param === "co_conc" ? "mg/m³" : "μg/m³"
    return `${value.toFixed(2)} ${unit}`
}

export default function AirLatestCard({ data, month }: Props) {
    if (!data) return null

    const averages = month.averages ?? {}

    return (
        <div className="rounded-[1.5rem] border border-cyan-100 bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-[#1a535c]">
                Συγκεντρώσεις Αέρα
                <span className="ml-2 text-base font-medium text-[#2992a2]">
                    ({month.month_name} {month.year})
                </span>
            </h4>

            <ul className="mt-4 space-y-3">
                {Object.entries(averages).map(([param, value]) => {
                    const label = param.replace("_conc", "").toUpperCase()
                    const limit = data.limits[param]
                    const limitDisplay = typeof limit === "number" ? `<=${limit}` : "—"

                    let statusIcon = <span className="text-slate-400">—</span>

                    if (typeof value === "number" && typeof limit === "number") {
                        statusIcon =
                            value <= limit ? (
                                <span title="Εντός ορίου">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                </span>
                            ) : (
                                <span title="Εκτός ορίου">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                </span>
                            )
                    }

                    return (
                        <li
                            key={param}
                            className="flex items-start justify-between gap-4 rounded-xl bg-[#f8fcfc] px-4 py-3"
                        >
                            <span className="min-w-0 flex-1 text-sm leading-6 text-[#1a535c]">
                                <strong>{label}</strong>: {typeof value === "number" ? formatUnit(param, value) : "—"}
                                <span className="ml-2 text-[#1a535c]/65">({limitDisplay})</span>
                            </span>

                            <div className="flex items-center gap-2">
                                {statusIcon}
                                <span
                                    title={PARAM_TOOLTIPS[param] ?? ""}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-50 text-cyan-700"
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
