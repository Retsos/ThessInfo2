import api from "@/lib/api"
import type {
    RecycleAreasResponse,
    RecycleCompareEntry,
    RecycleCompareResponse,
    RecycleEfficiencyEntry,
    RecycleEfficiencyResponse,
    RecycleMonthEntry,
    RecycleMonthlyResponse,
    RecycleResultsData,
    RecycleSummaryResponse,
} from "@/app/components/results/recycle/recycle-types"

/**
 * Fetch all recycling data for a given area.
 *
 * Calls /recycling/areas first to discover available years,
 * then fetches monthly + efficiency + compare for each year in parallel.
 */
export async function fetchRecycleResults(
    recycleKey: string
): Promise<RecycleResultsData | null> {
    if (!recycleKey) return null

    try {
        // 1. Discover available years
        const areasRes = await api.get<RecycleAreasResponse>("/recycling/areas")
        const years = areasRes.data.years ?? []

        if (!years.length) return null

        const latestYear = Math.max(...years)

        // 2. Fetch monthly data for each year (for this area)
        const monthlyPromises = years.map((year) =>
            api
                .get<RecycleMonthlyResponse>(
                    `/recycling/monthly?area=${encodeURIComponent(recycleKey)}&year=${year}`
                )
                .then((res) => ({ year, months: res.data.months }))
                .catch(() => ({ year, months: [] as RecycleMonthEntry[] }))
        )

        // 3. Fetch efficiency for each year
        const efficiencyPromises = years.map((year) =>
            api
                .get<RecycleEfficiencyResponse>(`/recycling/efficiency?year=${year}`)
                .then((res) => ({ year, months: res.data.months }))
                .catch(() => ({ year, months: [] as RecycleEfficiencyEntry[] }))
        )

        // 4. Fetch compare for each year
        const comparePromises = years.map((year) =>
            api
                .get<RecycleCompareResponse>(`/recycling/compare?year=${year}`)
                .then((res) => ({ year, comparison: res.data.comparison }))
                .catch(() => ({ year, comparison: [] as RecycleCompareEntry[] }))
        )

        // 5. Fetch summary for latest year
        const summaryPromise = api
            .get<RecycleSummaryResponse>(`/recycling/summary?year=${latestYear}`)
            .then((res) => res.data)
            .catch(() => null)

        // 6. Await all in parallel
        const [monthlyResults, efficiencyResults, compareResults, summary] =
            await Promise.all([
                Promise.all(monthlyPromises),
                Promise.all(efficiencyPromises),
                Promise.all(comparePromises),
                summaryPromise,
            ])

        // 7. Build lookup dicts keyed by year
        const monthly: Record<string, RecycleMonthEntry[]> = {}
        for (const { year, months } of monthlyResults) {
            if (months.length) monthly[String(year)] = months
        }

        const efficiency: Record<string, RecycleEfficiencyEntry[]> = {}
        for (const { year, months } of efficiencyResults) {
            if (months.length) efficiency[String(year)] = months
        }

        const compare: Record<string, RecycleCompareEntry[]> = {}
        for (const { year, comparison } of compareResults) {
            if (comparison.length) compare[String(year)] = comparison
        }

        return {
            area: recycleKey,
            years,
            monthly,
            efficiency,
            summary,
            compare,
        }
    } catch {
        return null
    }
}
