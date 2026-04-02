export type WaterStatus =
    | "Good"
    | "Bad"
    | "Warning"
    | "Unknown"
    | "Excellent"
    | "Poor"
    | "Very Poor"
    | "Unsuitable for drinking"

export interface WQIScore {
    score: number
    rating: WaterStatus | string
}

export interface WaterMeasurement {
    ts: string | null
    param: string
    val: number | null
    pct: number | null
    status: WaterStatus | string
}

export interface MonthlyAnalysisResponse {
    month: string
    measurements: WaterMeasurement[]
}

export interface MonthlyWQIEntry {
    month_ts: string
    wqi: WQIScore | null
}

export interface WaterOverallWQIResponse {
    year: string
    overall_wqi: WQIScore | null
    total_measurements: number
}

export interface AvailableMonthsResponse {
    available_months: string[]
    total: number
    latest: string | null
}

export interface WaterStatsApiResponse {
    [key: string]: unknown
}

export interface WaterStatsSummary {
    year: string | null
    expectedMeasurements: number
    recordedMeasurements: number
    compliance: number
    failures: number
    missing: number
}

export interface WaterTabData {
    availableMonths: AvailableMonthsResponse
    analysesByMonth: Record<string, MonthlyAnalysisResponse>
    monthlyWqiByYear: Record<string, MonthlyWQIEntry[]>
    overallWqiByYear: Record<string, WaterOverallWQIResponse>
    statsByYear: Record<string, WaterStatsSummary>
}

