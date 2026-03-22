"use client"

import { useMemo } from "react"
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts"
import type { WaterYearlyResponse } from "./water-types"

const COLORS = ["#413ea0", "#FF4C4C", "#CCCCCC"]

type Props = {
    yearlyData: WaterYearlyResponse | null
}

export default function WaterConclusionChart({ yearlyData }: Props) {
    const latestYear = useMemo(() => {
        const yrs = Object.keys(yearlyData ?? {})
            .filter((k) => /^\d{4}$/.test(k))
            .map(Number)
            .sort((a, b) => b - a)

        return yrs.length ? String(yrs[0]) : null
    }, [yearlyData])

    const summary = useMemo(() => {
        if (!latestYear || !yearlyData?.[latestYear]) {
            return null
        }

        const params = yearlyData[latestYear].parameters || {}

        let expected = 0
        let recorded = 0
        let compliant = 0

        Object.values(params).forEach((p) => {
            const total = p.total_count || 0
            const rec = Array.isArray(p.values) ? p.values.length : total
            const comp = p.compliant_count || 0

            expected += total
            recorded += rec
            compliant += comp
        })

        const missing = expected - recorded
        const nonCompliant = recorded - compliant

        return {
            expectedEvents: expected,
            recordedEvents: recorded,
            compliantCount: compliant,
            nonCompliantCount: nonCompliant,
            missingCount: missing,
            pieData: [
                { name: "Συμμορφώνεται", value: compliant },
                { name: "Μη συμμορφώνεται", value: nonCompliant },
                { name: "Χωρίς δεδομένα", value: missing },
            ],
        }
    }, [latestYear, yearlyData])

    if (!latestYear || !summary) {
        return (
            <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                <p className="text-sm text-[#1a535c]/75">Δεν υπάρχουν δεδομένα για σύνοψη έτους.</p>
            </div>
        )
    }

    return (
        <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-5 text-center shadow-sm">
            <h4 className="text-lg font-semibold text-[#1a535c]">
                Σύνοψη Μετρήσεων {latestYear}
            </h4>

            <div className="mt-4 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={summary.pieData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius="50%"
                            outerRadius="80%"
                            paddingAngle={2}
                            label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                        >
                            {summary.pieData.map((entry, idx) => (
                                <Cell key={entry.name} fill={COLORS[idx]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(val, name) => [`${val}`, name]} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <ul className="mt-4 space-y-1 text-left text-sm leading-6 text-[#1a535c]/82">
                <li><strong>Αναμενόμενες μετρήσεις:</strong> {summary.expectedEvents}</li>
                <li><strong>Μετρήσεις με δεδομένα:</strong> {summary.recordedEvents}</li>
                <li><strong>Συμμόρφωση:</strong> {summary.compliantCount}</li>
                <li><strong>Αποτυχίες:</strong> {summary.nonCompliantCount}</li>
                <li><strong>Χωρίς δεδομένα:</strong> {summary.missingCount}</li>
            </ul>
        </div>
    )
}