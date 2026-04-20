"use client"

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts"
import type { WaterStatsSummary } from "./water-types"

const COLORS = ["#16a34a", "#ef4444", "#94a3b8"]

type Props = {
    stats: WaterStatsSummary | null
    year: string | null
}

export default function WaterConclusionChart({ stats, year }: Props) {
    if (!stats) {
        return (
            <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                <p className="text-sm text-[#1a535c]/75">Δεν υπάρχουν διαθέσιμα δεδομένα σύνοψης για το έτος.</p>
            </div>
        )
    }

    const pieData = [
        { name: "Συμμόρφωση", value: stats.compliance },
        { name: "Αποτυχίες", value: stats.failures },
        { name: "Χωρίς δεδομένα", value: stats.missing },
    ]

    return (
        <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-5 text-center shadow-sm">
            <h4 className="text-lg font-semibold text-[#1a535c]">
                Σύνοψη έτους {year ?? stats.year ?? ""}
            </h4>

            <div className="mt-4 h-[220px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius="50%"
                            outerRadius="80%"
                            paddingAngle={2}
                            label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                        >
                            {pieData.map((entry, idx) => (
                                <Cell key={entry.name} fill={COLORS[idx]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(val, name) => [`${val}`, name]} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <ul className="mt-4 space-y-1 text-left text-sm leading-6 text-[#1a535c]/82">
                <li><strong>Αναμενόμενες μετρήσεις:</strong> {stats.expectedMeasurements}</li>
                <li><strong>Μετρήσεις με δεδομένα:</strong> {stats.recordedMeasurements}</li>
                <li><strong>Συμμόρφωση:</strong> {stats.compliance}</li>
                <li><strong>Αποτυχίες:</strong> {stats.failures}</li>
                <li><strong>Χωρίς δεδομένα:</strong> {stats.missing}</li>
            </ul>
        </div>
    )
}
