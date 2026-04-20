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
    Cell,
} from "recharts"
import type { RecycleCompareEntry } from "./recycle-types"

const BAR_COLORS = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"]

type Props = {
    comparison: RecycleCompareEntry[]
    year: number
}

export default function ComparisonBarChart({ comparison, year }: Props) {
    const chartData = useMemo(
        () =>
            comparison.map((entry) => ({
                area: entry.area,
                avg: entry.avg_kg_per_capita,
            })),
        [comparison]
    )

    if (!chartData.length) {
        return (
            <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                <p className="text-sm text-[#1a535c]/75">
                    Δεν υπάρχουν δεδομένα σύγκρισης.
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-[#1a535c]">
                Σύγκριση περιοχών — {year}
            </h4>
            <p className="mt-1 text-xs text-[#1a535c]/60">
                Μέσος όρος kg/κάτοικο — ποιος δήμος είναι &quot;καλός μαθητής&quot;
            </p>

            <div className="mt-4 h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 10, right: 30, bottom: 10, left: 10 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#dbeff0"
                            horizontal={false}
                        />
                        <XAxis
                            type="number"
                            tick={{ fill: "#333", fontSize: 12 }}
                            axisLine={{ stroke: "#333" }}
                            unit=" kg"
                        />
                        <YAxis
                            type="category"
                            dataKey="area"
                            width={140}
                            tick={{ fill: "#333", fontSize: 12 }}
                            axisLine={{ stroke: "#333" }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: 12,
                                border: "1px solid #d7eff0",
                                fontSize: 13,
                            }}
                            formatter={(value) => [
                                `${typeof value === "number" ? value : 0} kg/κάτοικο`,
                                "Μ.Ο.",
                            ]}
                        />
                        <Bar
                            dataKey="avg"
                            name="Μ.Ο. kg/κάτοικο"
                            radius={[0, 8, 8, 0]}
                            isAnimationActive={false}
                        >
                            {chartData.map((_entry, index) => (
                                <Cell
                                    key={index}
                                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
