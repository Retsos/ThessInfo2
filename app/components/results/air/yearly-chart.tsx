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
import type { AirDataResponse } from "./air-types"

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#413ea0"]

const PARAM_LABELS: Record<string, string> = {
    co_conc: "CO",
    no2_conc: "NO₂",
    no_conc: "NO",
    o3_conc: "O₃",
    so2_conc: "SO₂",
}

const abbreviate = (value: number) =>
    value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`

function CustomTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean
    payload?: Array<{ dataKey?: string; value?: number }>
    label?: string
}) {
    if (!active || !payload) return null

    const entries = payload
        .map((item, i) => ({
            key: item.dataKey || "",
            label: PARAM_LABELS[item.dataKey || ""] || item.dataKey || "",
            value: item.value,
            color: COLORS[i % COLORS.length],
        }))
        .sort((a, b) => {
            if (a.value == null) return 1
            if (b.value == null) return -1
            return b.value - a.value
        })

    return (
        <div className="rounded-xl border border-[#d7eff0] bg-white p-3 shadow-sm">
            <div className="mb-2 text-sm font-semibold text-[#1a535c]">{label}</div>

            {entries.map((entry) => (
                <div key={entry.key} className="flex items-center gap-2 text-sm text-[#1a535c]">
                    <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="flex-1">{entry.label}:</span>
                    <span>{entry.value != null ? entry.value.toFixed(2) : "–"}</span>
                </div>
            ))}
        </div>
    )
}

type Props = {
    yearlyData: AirDataResponse | null
}

export default function AirYearlyChart({ yearlyData }: Props) {
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
            const entry = yearlyData?.[year] as { averages?: Record<string, number | null> }
            const avg = entry?.averages || {}
            Object.keys(avg).forEach((p) => set.add(p))
        })

        return Array.from(set)
    }, [years, yearlyData])

    const chartData = useMemo(
        () =>
            years.map((year) => {
                const row: Record<string, string | number | null> = { year }
                const entry = yearlyData?.[year] as { averages?: Record<string, number | null> }
                const avg = entry?.averages || {}

                params.forEach((p) => {
                    row[p] = avg[p] != null ? avg[p] : null
                })

                return row
            }),
        [years, params, yearlyData]
    )

    if (!chartData.length) {
        return (
            <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                <p className="text-sm text-[#1a535c]/75">Δεν υπάρχουν δεδομένα για το διάγραμμα.</p>
            </div>
        )
    }

    return (
        <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-[#1a535c]">
                Εξέλιξη Ρύπων ανά Έτος
            </h4>

            <div className="mt-4 h-[320px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#dbeff0" />
                        <XAxis
                            dataKey="year"
                            tick={{ fill: "#333", fontSize: 12 }}
                            axisLine={{ stroke: "#333" }}
                        />
                        <YAxis
                            tickCount={5}
                            tickFormatter={(value) => abbreviate(Number(value))}
                            tick={{ fill: "#333", fontSize: 12 }}
                            axisLine={{ stroke: "#333" }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 5, fontSize: 13 }} />

                        {params.map((param, idx) => (
                            <Line
                                key={param}
                                dataKey={param}
                                name={PARAM_LABELS[param] || param}
                                stroke={COLORS[idx % COLORS.length]}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
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