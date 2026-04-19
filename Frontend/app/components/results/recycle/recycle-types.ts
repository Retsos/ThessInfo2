// ── Recycling API response types ──────────────────────────────────────────────

/** Single month entry from /recycling/monthly */
export type RecycleMonthEntry = {
    month: number
    month_name: string
    kg_total: number | null
    kg_per_capita: number | null
}

/** /recycling/monthly response */
export type RecycleMonthlyResponse = {
    area: string
    year: number
    months: RecycleMonthEntry[]
}

/** Single area entry from /recycling/compare */
export type RecycleCompareEntry = {
    area: string
    avg_kg_per_capita: number
    total_months: number
}

/** /recycling/compare response */
export type RecycleCompareResponse = {
    year: number
    comparison: RecycleCompareEntry[]
}

/** Single month entry from /recycling/efficiency */
export type RecycleEfficiencyEntry = {
    month: number
    month_name: string
    recyclables: number
    residual: number
    total: number
    efficiency: number
}

/** /recycling/efficiency response */
export type RecycleEfficiencyResponse = {
    year: number
    months: RecycleEfficiencyEntry[]
}

/** /recycling/summary response */
export type RecycleSummaryResponse = {
    year: number
    best_area: string | null
    worst_area: string | null
    avg_efficiency: number | null
    total_recyclables: number
    total_residual: number
    areas_ranking: RecycleCompareEntry[]
}

/** /recycling/areas response */
export type RecycleAreasResponse = {
    areas: string[]
    years: number[]
}

/** Combined data passed to the RecycleTab */
export type RecycleResultsData = {
    area: string
    years: number[]
    monthly: Record<string, RecycleMonthEntry[]>   // year → months
    efficiency: Record<string, RecycleEfficiencyEntry[]> // year → months
    summary: RecycleSummaryResponse | null
    compare: Record<string, RecycleCompareEntry[]>  // year → areas
}
