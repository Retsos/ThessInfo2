"use client"

import { useMemo } from "react"
import {
    ResponsiveContainer,
    ComposedChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
    Line,
} from "recharts"
import type { WaterLatestResponse } from "./water-types"

const ABBREVS: Record<string, string> = {
    "Θολότητα NTU": "Θολ.",
    "Χρώμα": "Χρ.",
    "Αργίλιο": "Αργ.",
    "Χλωριούχα": "Χλωρ.",
    "Αγωγιμότητα": "Αγωγ.",
    "Συγκέντρωση ιόντων υδρογόνου": "pH",
    "Υπολειμματικό χλώριο": "Υπλ.Χλ.",
}

type Props = {
    waterData: WaterLatestResponse
}

export default function WaterMonthlyChart({ waterData }: Props) {
    const { chartData, maxValue, maxLimit } = useMemo(() => {
        const analysis = waterData?.analysis ?? []
        if (!analysis.length) {
            return { chartData: [], maxValue: 0, maxLimit: 0 }
        }

        let mv = 0
        let ml = 0

        const mapped = analysis.map((item) => {
            const parsed = parseFloat(
                String(item.limit ?? "")
                    .replace(",", ".")
                    .replace(/[^\d.-]/g, "")
            )

            const limitNum = Number.isNaN(parsed) ? 0 : parsed
            const valNum = typeof item.value === "number" ? item.value : 0

            mv = Math.max(mv, valNum)
            ml = Math.max(ml, limitNum)

            return {
                parameter: item.parameter,
                value: valNum,
                limit: limitNum,
            }
        })

        return {
            chartData: mapped,
            maxValue: mv,
            maxLimit: ml,
        }
    }, [waterData])

    if (!chartData.length) {
        return (
            <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                <p className="text-sm text-[#1a535c]/75">Δεν υπάρχουν δεδομένα για το γράφημα.</p>
            </div>
        )
    }

    const month = waterData.latest_data?.[0]?.Month ?? ""
    const year = waterData.latest_data?.[0]?.Year ?? ""

    return (
        <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-[#1a535c]">
                Γράφημα για: {month} {year ? `(${year})` : ""}
            </h4>

            <div className="mt-4 h-[320px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={chartData}
                        margin={{ top: 10, right: 12, bottom: 30, left: 0 }}
                    >
                        <CartesianGrid stroke="#dbeff0" strokeDasharray="3 3" />

                        <XAxis
                            dataKey="parameter"
                            angle={-35}
                            textAnchor="end"
                            height={70}
                            tick={{ fill: "#1a535c", fontSize: 11 }}
                            tickFormatter={(param) => ABBREVS[param] || param}
                        />

                        <YAxis
                            yAxisId="left"
                            domain={[0, Math.ceil(maxValue * 1.1 || 10)]}
                            tick={{ fill: "#1a535c", fontSize: 11 }}
                        />

                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={[0, Math.ceil(maxLimit * 1.1 || 10)]}
                            tick={{ fill: "#f97316", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip
                            contentStyle={{
                                borderRadius: 12,
                                border: "1px solid #d7eff0",
                                backgroundColor: "#ffffff",
                            }}
                        />
                        <Legend />

                        <Bar
                            yAxisId="left"
                            dataKey="value"
                            name="Τιμή"
                            barSize={22}
                            fill="#5793f2"
                            radius={[6, 6, 0, 0]}
                        />

                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="limit"
                            name="Όριο"
                            stroke="#f97316"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            dot={{ r: 3, fill: "#f97316" }}
                            connectNulls
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}