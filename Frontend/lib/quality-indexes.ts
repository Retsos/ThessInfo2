export type QualityIndexKey = "eqi" | "aqi" | "wqi"

export type QualityBand = {
  min: number
  max: number
  label: string
  color: string
  bgClass: string
  textClass: string
  borderClass: string
}

export type QualityIndexScale = {
  key: QualityIndexKey
  code: string
  title: string
  bands: QualityBand[]
}

export const EQI_BANDS: QualityBand[] = [
  {
    min: 80,
    max: 100,
    label: "80-100 Excellent",
    color: "#0f766e",
    bgClass: "bg-teal-50",
    textClass: "text-teal-800",
    borderClass: "border-teal-200",
  },
  {
    min: 60,
    max: 79.99,
    label: "60-79 Good",
    color: "#22c55e",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-800",
    borderClass: "border-emerald-200",
  },
  {
    min: 40,
    max: 59.99,
    label: "40-59 Moderate",
    color: "#f59e0b",
    bgClass: "bg-amber-50",
    textClass: "text-amber-800",
    borderClass: "border-amber-200",
  },
  {
    min: 0,
    max: 39.99,
    label: "0-39 Poor",
    color: "#ef4444",
    bgClass: "bg-rose-50",
    textClass: "text-rose-800",
    borderClass: "border-rose-200",
  },
]

export const AQI_BANDS: QualityBand[] = [
  {
    min: 0,
    max: 50,
    label: "AQI 0-50 Good",
    color: "#16a34a",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-800",
    borderClass: "border-emerald-200",
  },
  {
    min: 51,
    max: 100,
    label: "AQI 51-100 Moderate",
    color: "#facc15",
    bgClass: "bg-yellow-50",
    textClass: "text-yellow-800",
    borderClass: "border-yellow-200",
  },
  {
    min: 101,
    max: 150,
    label: "AQI 101-150 Unhealthy for Sensitive Groups",
    color: "#f59e0b",
    bgClass: "bg-amber-50",
    textClass: "text-amber-800",
    borderClass: "border-amber-200",
  },
  {
    min: 151,
    max: 200,
    label: "AQI 151-200 Unhealthy",
    color: "#ef4444",
    bgClass: "bg-rose-50",
    textClass: "text-rose-800",
    borderClass: "border-rose-200",
  },
  {
    min: 201,
    max: 300,
    label: "AQI 201-300 Very Unhealthy",
    color: "#a855f7",
    bgClass: "bg-purple-50",
    textClass: "text-purple-800",
    borderClass: "border-purple-200",
  },
  {
    min: 301,
    max: 500,
    label: "AQI 301-500 Hazardous",
    color: "#7f1d1d",
    bgClass: "bg-red-100",
    textClass: "text-red-900",
    borderClass: "border-red-300",
  },
]

export const WQI_BANDS: QualityBand[] = [
  {
    min: 0,
    max: 25,
    label: "WQI 0-25 Excellent",
    color: "#16a34a",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-800",
    borderClass: "border-emerald-200",
  },
  {
    min: 26,
    max: 50,
    label: "WQI 26-50 Good",
    color: "#22c55e",
    bgClass: "bg-green-50",
    textClass: "text-green-800",
    borderClass: "border-green-200",
  },
  {
    min: 51,
    max: 75,
    label: "WQI 51-75 Moderate",
    color: "#f59e0b",
    bgClass: "bg-amber-50",
    textClass: "text-amber-800",
    borderClass: "border-amber-200",
  },
  {
    min: 76,
    max: 100,
    label: "WQI 76-100 Poor",
    color: "#f97316",
    bgClass: "bg-orange-50",
    textClass: "text-orange-800",
    borderClass: "border-orange-200",
  },
  {
    min: 101,
    max: 1000,
    label: "WQI >100 Unsuitable",
    color: "#b91c1c",
    bgClass: "bg-rose-50",
    textClass: "text-rose-800",
    borderClass: "border-rose-200",
  },
]

export const QUALITY_INDEX_SCALES: Record<QualityIndexKey, QualityIndexScale> = {
  eqi: {
    key: "eqi",
    code: "EQI",
    title: "Environmental Quality Index",
    bands: EQI_BANDS,
  },
  aqi: {
    key: "aqi",
    code: "AQI",
    title: "Air Quality Index",
    bands: AQI_BANDS,
  },
  wqi: {
    key: "wqi",
    code: "WQI",
    title: "Water Quality Index",
    bands: WQI_BANDS,
  },
}

export function getBandForScore(score: number, bands: QualityBand[]): QualityBand {
  const match = bands.find((band) => score >= band.min && score <= band.max)
  if (match) {
    return match
  }

  const sorted = [...bands].sort((a, b) => a.min - b.min)
  if (score < sorted[0].min) {
    return sorted[0]
  }
  return sorted[sorted.length - 1]
}
