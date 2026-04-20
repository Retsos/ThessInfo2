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
import type { MonthlyWQIEntry } from "./water-types"

type Props = {
    year: string | null
    entries: MonthlyWQIEntry[]
}

function formatMonthLabel(monthTs: string): string {
    const [yearStr, monthStr] = monthTs.split("-")
    const year = Number(yearStr)
    const month = Number(monthStr)

    if (!Number.isFinite(year) || !Number.isFinite(month)) return monthTs

    return `${String(month).padStart(2, "0")}/${year}`
}

export default function WaterMonthlyChart({ year, entries }: Props) {
    const chartData = useMemo(
        () =>
            entries.map((entry) => ({
                month: formatMonthLabel(entry.month_ts),
                score: entry.wqi?.score ?? null,
                rating: entry.wqi?.rating ?? "Unknown",
            })),
        [entries]
    )

    if (!chartData.length) {
        return (
            <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                <p className="text-sm text-[#1a535c]/75">Δεν υπάρχουν μηνιαία δεδομένα WQI για αυτό το έτος.</p>
            </div>
        )
    }

    return (
        <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-5 shadow-sm">
            <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white px-5 py-4 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="max-w-xl">
                        <h4 className="text-base sm:text-lg font-semibold text-[#1a535c] tracking-tight">
                            Μηνιαίο WQI
                        </h4>

                        <p className="mt-1.5 text-sm leading-relaxed text-[#1a535c]/70">
                            Η εξέλιξη του δείκτη ποιότητας νερού ανά μήνα για το επιλεγμένο έτος,
                            αποτυπώνοντας την συνολική περιβαλλοντική εικόνα της περιοχής.
                        </p>
                    </div>

                    {year && (
                        <div className="flex shrink-0 self-start items-center sm:self-auto">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-sky-800 ring-1 ring-sky-200 shadow-sm backdrop-blur">
                                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                                ΕΤΟΣ {year}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5 h-[320px] md:h-[360px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <LineChart data={chartData} margin={{ top: 10, right: 12, bottom: 10, left: 0 }}>
                        <CartesianGrid stroke="#dbeff0" strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fill: "#1a535c", fontSize: 11 }} />
                        <YAxis tick={{ fill: "#1a535c", fontSize: 11 }} domain={[0, 100]} />
                        <Tooltip
                            formatter={(value, _name, item) => {
                                const row = item?.payload as { rating?: string } | undefined
                                return [`${value}`, `WQI (${row?.rating ?? "Unknown"})`]
                            }}
                            contentStyle={{
                                borderRadius: 12,
                                border: "1px solid #d7eff0",
                                backgroundColor: "#ffffff",
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            name="WQI"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#0ea5e9" }}
                            connectNulls={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
