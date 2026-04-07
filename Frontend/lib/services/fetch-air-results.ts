import airApi from "@/lib/api2"
import type {
    AirMonthConcentrations,
    AirResultsData,
    AirMonthlyIndexEntry,
    AirYearlyIndexEntry,
} from "@/app/components/results/air/air-types"

type AirMonthlyIndexResponse = {
    area: string
    monthly_index: Record<string, AirMonthlyIndexEntry[]>
}

type AirYearlyIndexResponse = {
    area: string
    yearly_index: AirYearlyIndexEntry[]
}

const MAX_AIR_MONTHS = 300

function scoreToLabel(score: number | null): string {
    if (typeof score !== "number") return "No data"
    if (score >= 90) return "Excellent"
    if (score >= 75) return "Good"
    if (score >= 50) return "Moderate"
    return "Poor"
}

function normalizeMonthRow(row: AirMonthConcentrations): AirMonthConcentrations {
    const maybeLegacy = row as AirMonthConcentrations & { air_quality_percent?: number | null }
    const score =
        typeof row.aqi_score === "number"
            ? row.aqi_score
            : typeof maybeLegacy.air_quality_percent === "number"
              ? maybeLegacy.air_quality_percent
              : null

    return {
        ...row,
        aqi_score: score,
        aqi_label: row.aqi_label ?? scoreToLabel(score),
    }
}

function normalizeMonthlyIndex(rows: AirMonthlyIndexEntry[]): AirMonthlyIndexEntry[] {
    return rows.map((row) => {
        const maybeLegacy = row as AirMonthlyIndexEntry & { air_quality_percent?: number | null }
        const score =
            typeof row.aqi_score === "number"
                ? row.aqi_score
                : typeof maybeLegacy.air_quality_percent === "number"
                  ? maybeLegacy.air_quality_percent
                  : null
        return {
            ...row,
            aqi_score: score,
            aqi_label: row.aqi_label ?? scoreToLabel(score),
        }
    })
}

function normalizeYearlyIndex(rows: AirYearlyIndexEntry[]): AirYearlyIndexEntry[] {
    return rows.map((row) => {
        const maybeLegacy = row as AirYearlyIndexEntry & { air_quality_percent?: number | null }
        const score =
            typeof row.aqi_score === "number"
                ? row.aqi_score
                : typeof maybeLegacy.air_quality_percent === "number"
                  ? maybeLegacy.air_quality_percent
                  : null
        return {
            ...row,
            aqi_score: score,
            aqi_label: row.aqi_label ?? scoreToLabel(score),
        }
    })
}

function parseMonthKey(monthKey: string): { year: number; month: number } | null {
    const [yearRaw, monthRaw] = monthKey.split("-")
    const year = Number(yearRaw)
    const month = Number(monthRaw)

    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
        return null
    }

    return { year, month }
}

function buildYearlyAverages(rows: AirMonthConcentrations[]) {
    const byYear = new Map<number, AirMonthConcentrations[]>()

    rows.forEach((row) => {
        const current = byYear.get(row.year) ?? []
        current.push(row)
        byYear.set(row.year, current)
    })

    const result: Record<string, Record<string, number | null>> = {}

    byYear.forEach((yearRows, year) => {
        const pollutantSet = new Set<string>()
        yearRows.forEach((row) => {
            Object.keys(row.averages ?? {}).forEach((p) => pollutantSet.add(p))
        })

        const yearAverage: Record<string, number | null> = {}
        pollutantSet.forEach((pollutant) => {
            const values = yearRows
                .map((row) => row.averages?.[pollutant])
                .filter((v): v is number => typeof v === "number")

            yearAverage[pollutant] = values.length
                ? Number((values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(4))
                : null
        })

        result[String(year)] = yearAverage
    })

    return result
}

function buildMonthlyByYear(rows: AirMonthConcentrations[]) {
    const out: Record<string, AirMonthConcentrations[]> = {}

    rows.forEach((row) => {
        const key = String(row.year)
        if (!out[key]) out[key] = []
        out[key].push(row)
    })

    Object.keys(out).forEach((year) => {
        out[year].sort((a, b) => a.month - b.month)
    })

    return out
}

async function fetchAllMonths(areaKey: string): Promise<AirMonthConcentrations[]> {
    const encodedArea = encodeURIComponent(areaKey)
    const latestRes = await airApi.get<AirMonthConcentrations>(`/air/area/${encodedArea}/latest-month`)

    const first = normalizeMonthRow(latestRes.data)
    const allRows: AirMonthConcentrations[] = [first]
    const visited = new Set<string>([first.month_key])
    let previous = first.navigation?.previous ?? null

    for (let i = 0; i < MAX_AIR_MONTHS && previous; i += 1) {
        if (visited.has(previous)) break

        const parsed = parseMonthKey(previous)
        if (!parsed) break

        const monthRes = await airApi.get<AirMonthConcentrations>(
            `/air/area/${encodedArea}/month/${parsed.year}/${parsed.month}`
        )

        const normalized = normalizeMonthRow(monthRes.data)
        allRows.push(normalized)
        visited.add(normalized.month_key)
        previous = normalized.navigation?.previous ?? null
    }

    return allRows.sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month))
}

export async function fetchAirResults(areaKey: string): Promise<AirResultsData | null> {
    if (!areaKey) return null

    const encodedArea = encodeURIComponent(areaKey)

    const [allMonths, monthlyIndexRes, yearlyIndexRes] = await Promise.all([
        fetchAllMonths(areaKey),
        airApi.get<AirMonthlyIndexResponse>(`/air/area/${encodedArea}/air-index/monthly`),
        airApi.get<AirYearlyIndexResponse>(`/air/area/${encodedArea}/air-index/yearly`),
    ])

    if (!allMonths.length) return null

    const latestMonth = allMonths[allMonths.length - 1]

    return {
        area: latestMonth.area,
        limits: latestMonth.limits,
        latestMonth,
        months: allMonths,
        monthsByYear: buildMonthlyByYear(allMonths),
        yearlyAverages: buildYearlyAverages(allMonths),
        monthlyIndexByYear: Object.fromEntries(
            Object.entries(monthlyIndexRes.data.monthly_index ?? {}).map(([year, rows]) => [
                year,
                normalizeMonthlyIndex(rows),
            ])
        ),
        yearlyIndex: normalizeYearlyIndex(yearlyIndexRes.data.yearly_index ?? []),
    }
}
