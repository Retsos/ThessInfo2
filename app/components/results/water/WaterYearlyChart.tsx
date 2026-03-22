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
    Legend,
} from "recharts"
import type { WaterYearlyResponse } from "./water-types"

const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#413ea0",
    "#00c49f",
    "#ff8042",
]

const paramNames: Record<string, string> = {
    "Θολότητα NTU": "Θολότητα NTU",
    "Χρώμα": "Χρώμα",
    "Αργίλιο": "Αργίλιο",
    "Χλωριούχα": "Χλωριούχα",
    "Αγωγιμότητα": "Αγωγιμότητα",
    "Συγκέντρωση ιόντων υδρογόνου": "pH",
    "Υπολειμματικό χλώριο": "Υπολ. Χλώριο",
}

const abbreviate = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`)

type Props = {
    yearlyData: WaterYearlyResponse | null
}

function CustomTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean
    payload?: Array<{ dataKey?: string; value?: number }>
    label?: string
}) {
    if (!active) return null

    const entries = Object.keys(paramNames)
        .map((key, i) => {
            const found = payload?.find((p) => p.dataKey === key)
            return {
                key,
                color: COLORS[i % COLORS.length],
                value: found?.value ?? null,
            }
        })
        .sort((a, b) => (b.value ?? -Infinity) - (a.value ?? -Infinity))

    return (
        <div className="rounded-xl border border-[#d7eff0] bg-white p-3 shadow-sm">
            <div className="mb-2 text-sm font-semibold text-[#1a535c]">{label}</div>

            {entries.map((entry) => (
                <div key={entry.key} className="flex items-center gap-2 text-sm text-[#1a535c]">
                    <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="flex-1">{paramNames[entry.key]}:</span>
                    <span>{entry.value != null ? entry.value.toFixed(2) : "–"}</span>
                </div>
            ))}
        </div>
    )
}

export default function WaterYearlyChart({ yearlyData }: Props) {
    const years = useMemo(
        () =>
            Object.keys(yearlyData ?? {})
                .filter((k) => /^\d{4}$/.test(k))
                .sort((a, b) => +a - +b),
        [yearlyData]
    )

    const params = useMemo(() => {
        const set = new Set<string>()
        years.forEach((year) => {
            Object.keys(yearlyData?.[year]?.parameters ?? {}).forEach((p) => set.add(p))
        })
        return Array.from(set)
    }, [years, yearlyData])

    const chartData = useMemo(
        () =>
            years.map((year) => {
                const row: Record<string, string | number | null> = { year }
                params.forEach((p) => {
                    row[p] = yearlyData?.[year]?.parameters?.[p]?.average ?? null
                })
                return row
            }),
        [years, params, yearlyData]
    )

    if (!chartData.length) {
        return (
            <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                <p className="text-sm text-[#1a535c]/75">Δεν υπάρχουν ετήσια δεδομένα.</p>
            </div>
        )
    }

    return (
        <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-[#1a535c]">
                Εξέλιξη Παραμέτρων ανά Έτος
            </h4>

            <div className="mt-4 h-[280px] md:h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 12, bottom: 10, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#dbeff0" />
                        <XAxis dataKey="year" tick={{ fill: "#1a535c", fontSize: 11 }} />
                        <YAxis tickFormatter={(value) => abbreviate(Number(value))} tick={{ fill: "#1a535c", fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />

                        {params.map((p, i) => (
                            <Line
                                key={p}
                                dataKey={p}
                                name={paramNames[p] || p}
                                stroke={COLORS[i % COLORS.length]}
                                strokeWidth={2}
                                dot={{ r: 2 }}
                                activeDot={{ r: 4 }}
                                connectNulls={false}
                                isAnimationActive={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}