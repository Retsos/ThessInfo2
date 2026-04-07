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
import type { AirResultsData } from "./air-types"

const MONTH_LABELS: Record<string, string> = {
    January: "Ιαν",
    February: "Φεβ",
    March: "Μαρ",
    April: "Απρ",
    May: "Μαι",
    June: "Ιουν",
    July: "Ιουλ",
    August: "Αυγ",
    September: "Σεπ",
    October: "Οκτ",
    November: "Νοε",
    December: "Δεκ",
}

type Props = {
    data: AirResultsData | null
    selectedYear: number
}

export default function AirMonthlyComplianceChart({ data, selectedYear }: Props) {
    const yearKey = String(selectedYear)
    const monthlyIndex = data?.monthlyIndexByYear[yearKey] ?? []

    const chartData = useMemo(
        () =>
            monthlyIndex
                .slice()
                .sort((a, b) => a.month - b.month)
                .map((row) => ({
                    month: MONTH_LABELS[row.month_name] ?? row.month_name,
                    aqi: row.aqi_score ?? 0,
                })),
        [monthlyIndex]
    )

    if (!data) {
        return (
            <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                <p className="text-sm text-[#1a535c]/75">Δεν υπάρχουν δεδομένα συμμόρφωσης.</p>
            </div>
        )
    }

    return (
        <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-[#1a535c]">AQI ανά Μήνα - {yearKey}</h4>

            <div className="mt-4 h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#dbeff0" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(val) => `AQI ${val}`} />
                        <Line
                            type="monotone"
                            dataKey="aqi"
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
