"use client"

import { useMemo } from "react"
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts"
import type { AirResultsData } from "./air-types"

const COLORS: Record<string, string> = {
    co_conc: "#8884d8",
    no2_conc: "#82ca9d",
    no_conc: "#ffc658",
    o3_conc: "#ff7300",
    so2_conc: "#413ea0",
}

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

export default function AirMonthlyStackedBar({ data, selectedYear }: Props) {
    const yearKey = String(selectedYear)
    const monthly = data?.monthsByYear[yearKey] ?? []

    const chartData = useMemo(
        () =>
            monthly.map((row) => ({
                month: MONTH_LABELS[row.month_name] ?? row.month_name,
                ...row.averages,
            })),
        [monthly]
    )

    if (!data) {
        return (
            <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                <p className="text-sm text-[#1a535c]/75">Δεν υπάρχουν δεδομένα ρύπων.</p>
            </div>
        )
    }

    return (
        <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-[#1a535c]">Συγκεντρώσεις Ρύπων ανά Μήνα - {yearKey}</h4>

            <div className="mt-4 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#dbeff0" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend verticalAlign="top" />

                        {Object.keys(COLORS).map((key) => (
                            <Bar key={key} dataKey={key} stackId="a" fill={COLORS[key]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
