export function getQualityLevel(compliantCount: string | null | undefined) {
    const defaultResult = {
        color: "#cccccc",
        label: "Άγνωστη",
        tooltip: "Άγνωστη ποιότητα νερού",
        percentage: null as number | null,
    }

    if (!compliantCount) return defaultResult

    const parts = String(compliantCount).split(" of ")
    if (parts.length !== 2) return defaultResult

    const compliant = Number(parts[0])
    const total = Number(parts[1])

    if (!total || Number.isNaN(compliant) || Number.isNaN(total)) {
        return defaultResult
    }

    const percentage = (compliant / total) * 100

    const levels = [
        {
            min: 90,
            color: "#0000FF",
            label: "Εξαιρετική",
            tooltip: "Εξαιρετική ποιότητα νερού",
        },
        {
            min: 75,
            color: "#4f4fff",
            label: "Καλή",
            tooltip: "Καλή ποιότητα νερού",
        },
        {
            min: 50,
            color: "#8888FF",
            label: "Μέτρια",
            tooltip: "Μέτρια ποιότητα νερού",
        },
        {
            min: 0,
            color: "#ccccff",
            label: "Κακή",
            tooltip: "Κακή ποιότητα νερού",
        },
    ]

    const level = levels.find((l) => percentage >= l.min) || defaultResult

    return {
        ...level,
        percentage: Number(percentage.toFixed(2)),
    }
}

export const ENGLISH_MONTH_ORDER: Record<string, number> = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
}

export function getLatestRecycleYear(recycleData: any) {
    if (!recycleData?.Yearly_Stats) return null

    const years = Object.keys(recycleData.Yearly_Stats)
    const numericYears = years.map((y) => parseInt(y, 10)).filter((y) => !Number.isNaN(y))

    if (!numericYears.length) return null
    return Math.max(...numericYears)
}

export function getLatestAirMeasurement(airYearData: any) {
    if (!airYearData) return null

    const years = Object.keys(airYearData)
        .filter((k) => /^\d{4}$/.test(k))
        .map((y) => parseInt(y, 10))

    if (!years.length) return null

    const latestYear = String(Math.max(...years))
    const monthObj = airYearData[latestYear]?.monthly_averages

    if (!monthObj) return null

    const monthNames = Object.keys(monthObj)
    monthNames.sort((a, b) => ENGLISH_MONTH_ORDER[a] - ENGLISH_MONTH_ORDER[b])

    const latestMonthName = monthNames[monthNames.length - 1]
    const monthNumber = ENGLISH_MONTH_ORDER[latestMonthName]

    return {
        year: latestYear,
        month: monthNumber,
        data: monthObj[latestMonthName],
    }
}