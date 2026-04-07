export type AirLimits = Record<string, number>
export type AirAverages = Record<string, number | null>

export type AirMonthConcentrations = {
    area: string
    year: number
    month: number
    month_name: string
    month_key: string
    limits: AirLimits
    averages: AirAverages
    compliant_count: string
    aqi_score: number | null
    aqi_label: string
    records_count: number
    navigation?: {
        previous: string | null
        next: string | null
    }
}

export type AirMonthlyIndexEntry = {
    month: number
    month_name: string
    month_key: string
    aqi_score: number | null
    aqi_label: string
    compliant_count: string
}

export type AirYearlyIndexEntry = {
    year: number
    aqi_score: number | null
    aqi_label: string
    compliant_count: string
}

export type AirResultsData = {
    area: string
    limits: AirLimits
    latestMonth: AirMonthConcentrations
    months: AirMonthConcentrations[]
    monthsByYear: Record<string, AirMonthConcentrations[]>
    yearlyAverages: Record<string, AirAverages>
    monthlyIndexByYear: Record<string, AirMonthlyIndexEntry[]>
    yearlyIndex: AirYearlyIndexEntry[]
}
