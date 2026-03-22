export type WaterAnalysisItem = {
    parameter: string
    value: number | null
    unit?: string | null
    limit?: string | number | null
    is_compliant?: boolean | null
}

export type WaterLatestMeta = {
    Month?: string
    Year?: string | number
}

export type WaterLatestResponse = {
    compliantCount?: string | null
    month?: string | number
    year?: string | number
    analysis?: WaterAnalysisItem[]
    latest_data?: WaterLatestMeta[]
}

export type WaterYearParameter = {
    average?: number | null
    total_count?: number
    compliant_count?: number
    values?: unknown[]
}

export type WaterYearEntry = {
    parameters: Record<string, WaterYearParameter>
}

export type WaterYearlyResponse = Record<string, WaterYearEntry>