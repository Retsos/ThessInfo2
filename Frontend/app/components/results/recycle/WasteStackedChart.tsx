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
import type { RecycleEfficiencyEntry } from "./recycle-types"

const MONTH_SHORT = [
    "", "Ιαν", "Φεβ", "Μαρ", "Απρ", "Μάι", "Ιουν",
    "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ",
]

const abbreviateKg = (value: number) =>
    value >= 1_000_000
        ? `${(value / 1_000_000).toFixed(1)}M`
        : value >= 1000
          ? `${(value / 1000).toFixed(0)}k`
          : `${value}`

type Props = {
    efficiency: RecycleEfficiencyEntry[]
    year: number
    regionLabel: string
}

export default function WasteStackedChart({ efficiency, year, regionLabel }: Props) {
    const chartData = useMemo(
        () =>
            efficiency.map((entry) => ({
                month: MONTH_SHORT[entry.month],
                Ανακυκλώσιμα: entry.recyclables,
                Υπόλειμμα: entry.residual,
            })),
        [efficiency]
    )

    if (!chartData.length) {
        return (
            <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                <p className="text-sm text-[#1a535c]/75">
                    Δεν υπάρχουν δεδομένα waste breakdown.
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-[#1a535c]">
                Ανακυκλώσιμα vs Υπόλειμμα — {year}
            </h4>
            <p className="mt-1 text-xs text-[#1a535c]/60">
                Ποσότητες ανακυκλώσιμων σε σχέση με τα υπολείμματα στην περιοχή {regionLabel}
            </p>

            <div className="mt-4 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#dbeff0" />
                        <XAxis
                            dataKey="month"
                            tick={{ fill: "#333", fontSize: 12 }}
                            axisLine={{ stroke: "#333" }}
                        />
                        <YAxis
                            tickFormatter={abbreviateKg}
                            tick={{ fill: "#333", fontSize: 12 }}
                            axisLine={{ stroke: "#333" }}
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
                                `${typeof value === "number" ? value.toLocaleString("el-GR") : 0} kg`,
                                "",
                            ]}
                        />
                        <Legend
                            verticalAlign="top"
                            wrapperStyle={{ paddingBottom: 5, fontSize: 13 }}
                        />
                        <Bar
                            dataKey="Ανακυκλώσιμα"
                            stackId="waste"
                            fill="#10b981"
                            radius={[0, 0, 0, 0]}
                            isAnimationActive={true}
                        />
                        <Bar
                            dataKey="Υπόλειμμα"
                            stackId="waste"
                            fill="#f87171"
                            radius={[4, 4, 0, 0]}
                            isAnimationActive={true}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-4 rounded-xl bg-[#f8fdfd] p-3 text-sm text-[#1a535c]/80 border border-[#d7eff0]/50">
                <p>
                    <span className="font-semibold">Insight:</span> Το γράφημα δείχνει τον συνολικό όγκο απορριμμάτων της περιοχής <span className="font-medium">{regionLabel}</span>. Ιδανικά, το πράσινο τμήμα (ανακυκλώσιμα) πρέπει να είναι όσο το δυνατόν μεγαλύτερο σε σχέση με το κόκκινο (υπόλειμμα).
                </p>
            </div>
        </div>
    )
}
