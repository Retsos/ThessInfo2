"use client"

import { useMemo } from "react"
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
} from "recharts"
import type { RecycleEfficiencyEntry } from "./recycle-types"

const MONTH_SHORT = [
    "", "Ιαν", "Φεβ", "Μαρ", "Απρ", "Μάι", "Ιουν",
    "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ",
]

type Props = {
    efficiency: RecycleEfficiencyEntry[]
    year: number
    regionLabel: string
}

export default function EfficiencyChart({ efficiency, year, regionLabel }: Props) {
    const chartData = useMemo(
        () =>
            efficiency.map((entry) => ({
                month: MONTH_SHORT[entry.month],
                efficiency: Math.round(entry.efficiency * 100),
            })),
        [efficiency]
    )

    if (!chartData.length) {
        return (
            <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                <p className="text-sm text-[#1a535c]/75">
                    Δεν υπάρχουν δεδομένα efficiency.
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h4 className="text-lg font-semibold text-[#1a535c]">
                        Απόδοση Ανακύκλωσης (Efficiency) — {year}
                    </h4>
                    <p className="mt-1 text-xs text-[#1a535c]/60">
                        Ανακυκλώσιμα / (Ανακυκλώσιμα + Υπόλειμμα) — πόσο καλά γίνεται η
                        ανακύκλωση στην περιοχή {regionLabel}
                    </p>
                </div>
            </div>

            <div className="mt-4 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
                    >
                        <defs>
                            <linearGradient
                                id="efficiencyGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                                <stop offset="60%" stopColor="#f59e0b" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient
                                id="efficiencyStroke"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="60%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#ef4444" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#dbeff0" />
                        <XAxis
                            dataKey="month"
                            tick={{ fill: "#333", fontSize: 12 }}
                            axisLine={{ stroke: "#333" }}
                        />
                        <YAxis
                            domain={[0, 100]}
                            tickCount={6}
                            tick={{ fill: "#333", fontSize: 12 }}
                            axisLine={{ stroke: "#333" }}
                            unit="%"
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
                                `${typeof value === "number" ? value : 0}%`,
                                "Efficiency",
                            ]}
                        />
                        <ReferenceLine
                            y={70}
                            stroke="#f59e0b"
                            strokeDasharray="6 3"
                            label={{
                                value: "70% target",
                                position: "insideTopRight",
                                fill: "#b45309",
                                fontSize: 11,
                            }}
                        />
                        <Area
                            dataKey="efficiency"
                            name="Efficiency %"
                            stroke="url(#efficiencyStroke)"
                            strokeWidth={3}
                            fill="url(#efficiencyGradient)"
                            dot={{ r: 4, fill: "#333" }}
                            activeDot={{ r: 6 }}
                            isAnimationActive={true}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-4 rounded-xl bg-[#f8fdfd] p-3 text-sm text-[#1a535c]/80 border border-[#d7eff0]/50">
                <p>
                    <span className="font-semibold text-amber-600">💡 Ενδεικτικό όριο (70%):</span> Θεωρείται το ελάχιστο ποσοστό καλής απόδοσης (benchmark).
                </p>
                <p className="mt-1">
                    <span className="font-semibold">Insight:</span> Η πορεία της απόδοσης στην περιοχή <span className="font-medium">{regionLabel}</span> δείχνει κατά πόσο η διαλογή στην πηγή είναι αποτελεσματική ή χρειάζεται βελτίωση.
                </p>
            </div>
        </div>
    )
}
