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
import type { AirDataResponse } from "./air-types"

const COLORS: Record<string, string> = {
    co_conc: "#8884d8",
    no2_conc: "#82ca9d",
    no_conc: "#ffc658",
    o3_conc: "#ff7300",
    so2_conc: "#413ea0",
}

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

export default function AirMonthlyStackedBar({ airData }: Props) {
    const years = Object.keys(airData ?? {}).filter((k) => /^\d{4}$/.test(k))
    if (!years.length) {
        return (
            <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                <p className="text-sm text-[#1a535c]/75">Δεν υπάρχουν δεδομένα ρύπων.</p>
            </div>
        )
    }

    const latestYear = String(Math.max(...years.map((y) => +y)))
    const latestYearEntry = airData?.[latestYear] as {
        monthly_averages?: Record<string, { averages?: Record<string, number | null> }>
    }
    const monthly = latestYearEntry?.monthly_averages || {}

    const data = useMemo(() => {
        return Object.entries(monthly)
            .map(([engMonth, entry]) => ({
                month: MONTH_MAP[engMonth] || engMonth,
                ...(entry?.averages ?? {}),
            }))
            .sort((a, b) => {
                const order = Object.values(MONTH_MAP)
                return order.indexOf(a.month) - order.indexOf(b.month)
            })
    }, [monthly])

    return (
        <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-[#1a535c]">
                Συγκεντρώσεις Ρύπων ανά Μήνα — {latestYear}
            </h4>

            <div className="mt-4 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
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