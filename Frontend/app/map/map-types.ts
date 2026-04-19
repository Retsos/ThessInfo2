import type { MapAreaRow } from "../components/map/environment-map"
import type { QualityBand } from "@/lib/quality-indexes"

export type MetricKey = "overall" | "air" | "water" | "recycle"

export type SharedAreaPayload = {
  area: string
  aliases: string[]
  metrics: {
    air: { aqi_raw: number | null; air_norm: number | null; aqi_label: string | null }
    water: { wqi_raw: number | null; water_norm: number | null; wqi_rating: string | null }
    eqi: { eqi_raw: number | null; eqi_display: number | null; band: string | null }
    recycle?: { score: number | null }
  }
  dominant_factor: string | null
  sources?: {
    air_area: string | null
    water_area: string | null
    air_month: string | null
    water_month: string | null
    common_month: string | null
  }
}

export type MetricConfig = {
  title: string
  hint: string
  buttonLabel: string
  indexCode: string
  color: string
  colorSoft: string
  legend: QualityBand[]
}

export type MetricModalContent = {
  button: string
  title: string
  placeholder: string
}

export type MapRowWithSource = MapAreaRow & { source?: SharedAreaPayload }

export type AreaSelection = {
  mapAreaName: string
  row: MapRowWithSource | null
}

