"use client"

import { Percent, Weight, Trash2, Package } from "lucide-react"
import type { RecycleSummaryResponse } from "./recycle-types"

type Props = {
    summary: RecycleSummaryResponse | null
    selectedYear: number
}

function formatKg(value: number): string {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M kg`
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k kg`
    return `${value} kg`
}

export default function RecycleSummaryCards({ summary, selectedYear }: Props) {
    if (!summary) {
        return null
    }

    const totalWaste = summary.total_recyclables + summary.total_residual

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Avg efficiency */}
            <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-amber-600" />
                    <p className="text-sm font-medium text-[#1a535c]/70">
                        Μ.Ο. Efficiency
                    </p>
                </div>
                <p className="mt-2 text-2xl font-bold text-amber-700">
                    {summary.avg_efficiency != null
                        ? `${Math.round(summary.avg_efficiency * 100)}%`
                        : "-"}
                </p>
                <p className="mt-1 text-xs text-[#1a535c]/55">
                    Ανακυκλ. / (Ανακυκλ. + Υπόλ.)
                </p>
            </div>

            {/* Total recyclables */}
            <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-sky-600" />
                    <p className="text-sm font-medium text-[#1a535c]/70">
                        Σύνολο ανακυκλώσιμων
                    </p>
                </div>
                <p className="mt-2 text-2xl font-bold text-sky-700">
                    {formatKg(summary.total_recyclables)}
                </p>
                <p className="mt-1 text-xs text-[#1a535c]/55">{selectedYear}</p>
            </div>

            {/* Total residual */}
            <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-rose-500" />
                    <p className="text-sm font-medium text-[#1a535c]/70">
                        Σύνολο υπολειμμάτων
                    </p>
                </div>
                <p className="mt-2 text-2xl font-bold text-rose-600">
                    {formatKg(summary.total_residual)}
                </p>
                <p className="mt-1 text-xs text-[#1a535c]/55">{selectedYear}</p>
            </div>

            {/* Total waste */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-slate-500" />
                    <p className="text-sm font-medium text-[#1a535c]/70">
                        Συνολικά απορρίμματα
                    </p>
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-700">
                    {formatKg(totalWaste)}
                </p>
                <p className="mt-1 text-xs text-[#1a535c]/55">{selectedYear}</p>
            </div>
        </div>
    )
}
