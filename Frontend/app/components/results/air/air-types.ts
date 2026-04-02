export type AirMonthlyAverages = Record<string, number | null>

export type AirMonthlyEntry = {
    averages?: AirMonthlyAverages
    compliant_count?: string
}

export type AirYearEntry = {
    monthly_averages?: Record<string, AirMonthlyEntry>
    averages?: Record<string, number | null>
}

export type AirDataResponse = {
    limits?: Record<string, string>
    area?: string
    [year: string]: unknown
} & Record<string, AirYearEntry | Record<string, string> | string | undefined>