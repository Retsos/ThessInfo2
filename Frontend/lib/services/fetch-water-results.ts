import api2 from "@/lib/api2"
import type {
    AvailableMonthsResponse,
    MonthlyAnalysisResponse,
    MonthlyWQIEntry,
    WaterMeasurement,
    WaterOverallWQIResponse,
    WaterStatsApiResponse,
    WaterStatsSummary,
    WaterTabData,
} from "@/app/components/results/water/water-types"

function extractData<T>(result: PromiseSettledResult<unknown>): T | null {
    if (
        result.status === "fulfilled" &&
        result.value &&
        typeof result.value === "object" &&
        "data" in result.value
    ) {
        return (result.value as { data: T }).data
    }

    return null
}

function normalizeMeasurement(raw: unknown): WaterMeasurement | null {
    if (!raw || typeof raw !== "object") return null

    const entry = raw as Record<string, unknown>
    const param = typeof entry.param === "string" ? entry.param : null

    if (!param) return null

    return {
        ts: typeof entry.ts === "string" ? entry.ts : null,
        param,
        val: typeof entry.val === "number" ? entry.val : null,
        pct: typeof entry.pct === "number" ? entry.pct : null,
        status: typeof entry.status === "string" ? entry.status : "Unknown",
    }
}

function normalizeAnalysis(raw: unknown, fallbackMonthTs: string): MonthlyAnalysisResponse {
    const source = raw as {
        month?: unknown
        measurements?: unknown[]
    }

    const measurements = Array.isArray(source?.measurements)
        ? source.measurements
              .map((m) => normalizeMeasurement(m))
              .filter((m): m is WaterMeasurement => m !== null)
        : []

    return {
        month:
            typeof source?.month === "string" && source.month
                ? source.month
                : fallbackMonthTs,
        measurements,
    }
}

function normalizeStats(raw: WaterStatsApiResponse | null): WaterStatsSummary | null {
    if (!raw) return null

    const canonical = (s: string) =>
        s
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()

    const getByKey = (targetKey: string) => {
        const wanted = canonical(targetKey)
        const key = Object.keys(raw).find((k) => canonical(k) === wanted)
        return key ? raw[key] : undefined
    }

    const numberOrZero = (v: unknown) => {
        if (typeof v === "number") return v
        if (typeof v === "string") {
            const parsed = Number(v)
            return Number.isFinite(parsed) ? parsed : 0
        }
        return 0
    }

    return {
        year:
            typeof getByKey("Έτος") === "string"
                ? (getByKey("Έτος") as string)
                : typeof raw.year === "string"
                  ? raw.year
                  : null,
        expectedMeasurements: numberOrZero(
            getByKey("Αναμενόμενες μετρήσεις") ?? raw.expected_measurements
        ),
        recordedMeasurements: numberOrZero(
            getByKey("Μετρήσεις με δεδομένα") ?? raw.recorded_measurements
        ),
        compliance: numberOrZero(getByKey("Συμμόρφωση") ?? raw.compliance),
        failures: numberOrZero(getByKey("Αποτυχίες") ?? raw.failures),
        missing: numberOrZero(getByKey("Χωρίς δεδομένα") ?? raw.missing),
    }
}

function sortMonthTs(months: string[]): string[] {
    return [...months].sort((a, b) => a.localeCompare(b))
}

function getYearsFromMonths(months: string[]): string[] {
    const yearSet = new Set<string>()

    for (const monthTs of months) {
        const year = monthTs.slice(0, 4)
        if (/^\d{4}$/.test(year)) {
            yearSet.add(year)
        }
    }

    return Array.from(yearSet).sort((a, b) => a.localeCompare(b))
}

export async function fetchWaterResults(areaName: string): Promise<WaterTabData | null> {
    const monthsRes = await api2.get(
        `/water/months/${encodeURIComponent(areaName)}`
    )

    const monthsPayload = (monthsRes.data ?? null) as AvailableMonthsResponse | null

    if (!monthsPayload || !Array.isArray(monthsPayload.available_months)) {
        return null
    }

    const availableMonths = sortMonthTs(monthsPayload.available_months)

    if (!availableMonths.length) {
        return {
            availableMonths: {
                available_months: [],
                total: 0,
                latest: null,
            },
            analysesByMonth: {},
            monthlyWqiByYear: {},
            overallWqiByYear: {},
            statsByYear: {},
        }
    }

    const analysesSettled = await Promise.allSettled(
        availableMonths.map((monthTs) =>
            api2.get(
                `/water/analysis/${encodeURIComponent(areaName)}/${encodeURIComponent(monthTs)}`
            )
        )
    )

    const analysesByMonth: Record<string, MonthlyAnalysisResponse> = {}

    analysesSettled.forEach((result, index) => {
        const payload = extractData<unknown>(result)
        if (!payload) return

        const monthTs = availableMonths[index]
        analysesByMonth[monthTs] = normalizeAnalysis(payload, monthTs)
    })

    const years = getYearsFromMonths(availableMonths)

    const yearlySettled = await Promise.allSettled(
        years.map(async (year) => {
            const [monthlyWqiRes, overallWqiRes, statsRes] = await Promise.allSettled([
                api2.get(
                    `/water/wqi/monthly/${encodeURIComponent(areaName)}/${encodeURIComponent(year)}`
                ),
                api2.get(
                    `/water/wqi/overall/${encodeURIComponent(areaName)}/${encodeURIComponent(year)}`
                ),
                api2.get(
                    `/water/stats/${encodeURIComponent(areaName)}/${encodeURIComponent(year)}`
                ),
            ])

            const monthlyWqiRaw = extractData<unknown[]>(monthlyWqiRes) ?? []
            const monthlyWqi: MonthlyWQIEntry[] = monthlyWqiRaw
                .map((row) => {
                    const r = row as {
                        month_ts?: unknown
                        wqi?: {
                            score?: unknown
                            rating?: unknown
                        } | null
                    }

                    if (typeof r.month_ts !== "string") return null

                    const score =
                        typeof r.wqi?.score === "number" ? r.wqi.score : null
                    const rating =
                        typeof r.wqi?.rating === "string" ? r.wqi.rating : "Unknown"

                    return {
                        month_ts: r.month_ts,
                        wqi: score == null ? null : { score, rating },
                    }
                })
                .filter((row): row is MonthlyWQIEntry => row !== null)
                .sort((a, b) => a.month_ts.localeCompare(b.month_ts))

            const overallRaw = extractData<unknown>(overallWqiRes)
            const overallObj = overallRaw as {
                year?: unknown
                overall_wqi?: { score?: unknown; rating?: unknown } | null
                total_measurements?: unknown
            }

            const overall: WaterOverallWQIResponse | null =
                typeof overallObj?.year === "string"
                    ? {
                          year: overallObj.year,
                          overall_wqi:
                              typeof overallObj.overall_wqi?.score === "number" &&
                              typeof overallObj.overall_wqi?.rating === "string"
                                  ? {
                                        score: overallObj.overall_wqi.score,
                                        rating: overallObj.overall_wqi.rating,
                                    }
                                  : null,
                          total_measurements:
                              typeof overallObj.total_measurements === "number"
                                  ? overallObj.total_measurements
                                  : 0,
                      }
                    : null

            const stats = normalizeStats(extractData<WaterStatsApiResponse>(statsRes))

            return {
                year,
                monthlyWqi,
                overall,
                stats,
            }
        })
    )

    const monthlyWqiByYear: Record<string, MonthlyWQIEntry[]> = {}
    const overallWqiByYear: Record<string, WaterOverallWQIResponse> = {}
    const statsByYear: Record<string, WaterStatsSummary> = {}

    yearlySettled.forEach((result) => {
        if (result.status !== "fulfilled") return

        const entry = result.value
        monthlyWqiByYear[entry.year] = entry.monthlyWqi

        if (entry.overall) {
            overallWqiByYear[entry.year] = entry.overall
        }

        if (entry.stats) {
            statsByYear[entry.year] = entry.stats
        }
    })

    return {
        availableMonths: {
            available_months: availableMonths,
            total: monthsPayload.total ?? availableMonths.length,
            latest:
                monthsPayload.latest ??
                [...availableMonths].sort((a, b) => b.localeCompare(a))[0] ??
                null,
        },
        analysesByMonth,
        monthlyWqiByYear,
        overallWqiByYear,
        statsByYear,
    }
}

