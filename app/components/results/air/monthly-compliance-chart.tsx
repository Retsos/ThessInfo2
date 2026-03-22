"use client"

import { useMemo } from "react"
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts"
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

type Props = {
    airData: AirDataResponse | null
}

export default function AirMonthlyComplianceChart({ airData }: Props) {
    const years = Object.keys(airData ?? {}).filter((k) => /^\d{4}$/.test(k))
    if (!years.length) {
        return (
            <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                <p className="text-sm text-[#1a535c]/75">Δεν υπάρχουν δεδομένα συμμόρφωσης.</p>
            </div>
        )
    }

    const latestYear = String(Math.max(...years.map((y) => +y)))
    const latestYearEntry = airData?.[latestYear] as {
        monthly_averages?: Record<string, { compliant_count?: string }>
    }
    const monthly = latestYearEntry?.monthly_averages || {}

    const data = useMemo(() => {
        return Object.entries(monthly)
            .map(([engMonth, entry]) => {
                const compliant = entry?.compliant_count ?? ""
                const [num, den] = compliant.split("/").map((n) => +n)
                const pct = den ? +((num / den) * 100).toFixed(1) : 0

                return {
                    month: MONTH_MAP[engMonth] || engMonth,
                    compliance: pct,
                }
            })
            .sort((a, b) => {
                const order = Object.values(MONTH_MAP)
                return order.indexOf(a.month) - order.indexOf(b.month)
            })
    }, [monthly])

    return (
        <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-[#1a535c]">
                Ποσοστό Συμμόρφωσης ανά Μήνα — {latestYear}
            </h4>

            <div className="mt-4 h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#dbeff0" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} unit="%" />
                        <Tooltip formatter={(val) => `${val}%`} />
                        <Line
                            type="monotone"
                            dataKey="compliance"
                            stroke="#4CAF50"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}