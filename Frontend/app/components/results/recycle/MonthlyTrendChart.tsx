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
import type { RecycleMonthEntry } from "./recycle-types"

const YEAR_COLORS: Record<string, string> = {
    "2023": "#10b981",
    "2024": "#0ea5e9",
    "2025": "#8b5cf6",
    "2026": "#f59e0b",
}

const MONTH_SHORT = [
    "", "Ιαν", "Φεβ", "Μαρ", "Απρ", "Μάι", "Ιουν",
    "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ",
]

type Props = {
    monthly: Record<string, RecycleMonthEntry[]>
    years: number[]
    regionLabel: string
}

export default function MonthlyTrendChart({ monthly, years, regionLabel }: Props) {
    const chartData = useMemo(() => {
        const rows: Record<string, string | number | null>[] = []

        for (let m = 1; m <= 12; m++) {
            const row: Record<string, string | number | null> = {
                month: MONTH_SHORT[m],
            }

            let hasAny = false
            for (const year of years) {
                const entries = monthly[String(year)] ?? []
                const entry = entries.find((e) => e.month === m)
                row[String(year)] = entry?.kg_per_capita ?? null
                if (entry?.kg_per_capita != null) hasAny = true
            }

            if (hasAny) rows.push(row)
        }

        return rows
    }, [monthly, years])

    if (!chartData.length) {
        return (
            <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                <p className="text-sm text-[#1a535c]/75">
                    Δεν υπάρχουν δεδομένα kg/κάτοικο.
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-[#1a535c]">
                Μηνιαία εξέλιξη (kg/κάτοικο)
            </h4>
            <p className="mt-1 text-xs text-[#1a535c]/60">
                Πόσα κιλά ανακυκλώνει κάθε κάτοικος ανά μήνα στην περιοχή {regionLabel}
            </p>

            <div className="mt-4 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#dbeff0" />
                        <XAxis
                            dataKey="month"
                            tick={{ fill: "#333", fontSize: 12 }}
                            axisLine={{ stroke: "#333" }}
                        />
                        <YAxis
                            tickCount={6}
                            tick={{ fill: "#333", fontSize: 12 }}
                            axisLine={{ stroke: "#333" }}
                            unit=" kg"
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: 12,
                                border: "1px solid #d7eff0",
                                fontSize: 13,
                                backgroundColor: "#ffffff",
                                color: "#1a535c",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                padding: "8px 12px"
                            }}
                            formatter={(value) => [
                                `${typeof value === "number" ? value : 0} kg/κάτοικο`,
                                "",
                            ]}
                        />
                        <Legend
                            verticalAlign="top"
                            wrapperStyle={{ paddingBottom: 5, fontSize: 13 }}
                        />

                        {years.map((year) => (
                            <Line
                                key={year}
                                dataKey={String(year)}
                                name={String(year)}
                                stroke={YEAR_COLORS[String(year)] ?? "#6b7280"}
                                strokeWidth={2.5}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                connectNulls={false}
                                isAnimationActive={true}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-4 rounded-xl bg-[#f8fdfd] p-3 text-sm text-[#1a535c]/80 border border-[#d7eff0]/50">
                <p>
                    <span className="font-semibold">Insight:</span> Το διάγραμμα δείχνει τις μηνιαίες διακυμάνσεις για την περιοχή <span className="font-medium">{regionLabel}</span>. Παρατήρησε αν υπάρχουν εποχικές τάσεις (π.χ. πτώση το καλοκαίρι λόγω διακοπών) ή αν υπάρχει σταθερή βελτίωση κάθε έτος.
                </p>
            </div>
        </div>
    )
}
