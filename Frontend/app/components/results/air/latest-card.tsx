"use client"

import { CheckCircle2, Info, XCircle } from "lucide-react"
import type { AirDataResponse } from "./air-types"

const MONTH_MAP: Record<string, string> = {
    January: "Ιαν",
    February: "Φεβ",
    March: "Μαρ",
    April: "Απρ",
    May: "Μαϊ",
    June: "Ιουν",
    July: "Ιουλ",
    August: "Αυγ",
    September: "Σεπ",
    October: "Οκτ",
    November: "Νοε",
    December: "Δεκ",
}

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
    airData: AirDataResponse | null
}

export default function AirLatestCard({ airData }: Props) {
    if (!airData) return null

    const { limits = {}, area: _area, ...yearsData } = airData
    const yearKeys = Object.keys(yearsData).filter((k) => /^\d{4}$/.test(k))

    if (!yearKeys.length) {
        return (
            <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                <p className="text-sm text-[#1a535c]/75">
                    Δεν υπάρχουν δεδομένα αέρα.
                </p>
            </div>
        )
    }

    const latestYear = String(Math.max(...yearKeys.map((y) => parseInt(y, 10))))
    const yearEntry = yearsData[latestYear] as {
        monthly_averages?: Record<string, { averages?: Record<string, number | null> }>
    }

    const months = Object.keys(yearEntry?.monthly_averages ?? {})
    const validMonths = months.filter((month) => MONTH_MAP[month])

    validMonths.sort((a, b) => months.indexOf(a) - months.indexOf(b))

    const latestMonthKey = validMonths[validMonths.length - 1]
    const latestMonthLabel = MONTH_MAP[latestMonthKey] ?? latestMonthKey
    const latestDataObj = yearEntry?.monthly_averages?.[latestMonthKey] ?? {}
    const averages = latestDataObj.averages ?? {}

    return (
        <div className="rounded-[1.5rem] border border-cyan-100 bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-[#1a535c]">
                Συγκεντρώσεις Αέρα
                <span className="ml-2 text-base font-medium text-[#2992a2]">
                    ({latestMonthLabel} {latestYear})
                </span>
            </h4>

            <ul className="mt-4 space-y-3">
                {Object.entries(averages).map(([param, value]) => {
                    const label = param.replace("_conc", "").toUpperCase()
                    const limitStr = limits[param] || ""
                    const limitVal = parseFloat(String(limitStr).replace(/[^0-9.]/g, ""))
                    const displayValue =
                        value != null ? `${Number(value).toFixed(2)} μg/m³` : "—"

                    let statusIcon = <span className="text-slate-400">—</span>

                    if (value != null && !Number.isNaN(limitVal)) {
                        statusIcon =
                            Number(value) <= limitVal ? (
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
                                <strong>{label}</strong>: {displayValue}
                                <span className="ml-2 text-[#1a535c]/65">({limitStr})</span>
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
