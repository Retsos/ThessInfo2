import { create } from "zustand"
import type { RegionCatalogItem } from "@/app/data/region-catalog"
import { fetchRegionResults, type RegionResultsData } from "@/lib/services/fetch-region-results"
import airApi from "@/lib/api2"

// --- Types ---
export type SharedAreaPayload = {
  area: string
  aliases: string[]
  metrics: {
    air: { aqi_raw: number | null; air_norm: number | null; aqi_label: string | null }
    water: { wqi_raw: number | null; water_norm: number | null; wqi_rating: string | null }
    eqi: { eqi_raw: number | null; eqi_display: number | null; band: string | null }
    recycle?: { score: number }
  }
  dominant_factor: string | null
}

type AirAreasResponse = { areas?: string[] }
type AirLatestMonthResponse = {
  aqi_score?: number | null
  aqi_label?: string | null
}

export type RankedRow = {
  area: string
  label: string
  score: number
  badgeLabel: string | null
  dominantFactor: string | null
}

interface DataState {
  // Shared QI (Overall, Water)
  sharedQiData: SharedAreaPayload[] | null
  sharedQiLoading: boolean

  // Air Map Data
  airMapData: SharedAreaPayload[] | null
  airMapLoading: boolean

  // Recycle Data
  recycleCompareData: SharedAreaPayload[] | null
  recycleEfficiencyData: SharedAreaPayload[] | null
  recycleLoading: boolean

  // Area Search Caching
  regionResultsCache: Record<string, RegionResultsData | undefined>
  regionResultsLoading: Record<string, boolean | undefined>

  // Actions
  fetchSharedQi: () => Promise<void>
  fetchAirMap: () => Promise<void>
  fetchRecycleData: () => Promise<void>
  getRegionResults: (region: RegionCatalogItem) => Promise<RegionResultsData | null>
}

// --- Constants ---
const AIR_AREA_ALIASES: Record<string, string[]> = {
  Ampelokipoi: ["Ampelokipoi Municipality", "Ampelokipi - Menemeni Municipality", "Δήμος Αμπελοκήπων - Μενεμένης"],
  Chalkidonos: ["Chalkidona Municipality", "Δήμος Χαλκηδόνας"],
  Delta: ["Delta Municipality", "Δήμος Δέλτα"],
  Kalamaria: ["Kalamaria Municipality", "Δήμος Καλαμαριάς"],
  Kordelio: ["Kordelio Municipality", "Evosmos Municipality", "Kordelio-Evosmos Municipality", "Kordelio - Evosmos Municipality", "Δήμος Κορδελιού - Ευόσμου"],
  Lagkadas: ["Lagkadas Municipality", "Municipality of Lagadas", "Lagadas", "Δήμος Λαγκαδά"],
  Neapoli: ["Neapoli Municipality", "Neapolis-Sykeon Municipality", "Municipality of Neapoli-Sykies", "Δήμος Νεάπολης - Συκεών"],
  Oraiokastro: ["Oreokastro Municipality", "Oraiokastro Municipality", "Δήμος Ωραιοκάστρου"],
  Pavlou_Mela: ["Pavlou Mela Municipality", "Pavlos Melas Municipality", "Δήμος Παύλου Μελά"],
  Pulaia: ["Pylaia Municipality", "Pulaia Municipality", "Municipality of Pylaia - Chortiatis", "Pylaia - Chortiatis", "Δήμος Πυλαίας - Χορτιάτη"],
  Thermaikos: ["Thermaikos Municipality", "Δήμος Θερμαϊκού"],
  Thermi: ["Thermi Municipality", "Δήμος Θέρμης"],
  Thessaloniki: ["Thessaloniki Municipality", "Municipality of Thessaloniki", "Δήμος Θεσσαλονίκης"],
  Volvi: ["Volvi Municipality", "Δήμος Βόλβης"],
}

const RECYCLE_TO_MAP_ALIASES: Record<string, string[]> = {
  "ΘΕΡΜΗ": ["Thermi Municipality", "Δήμος Θέρμης", "Thermi"],
  "ΚΑΛΑΜΑΡΙΑ": ["Kalamaria Municipality", "Δήμος Καλαμαριάς", "Kalamaria"],
  "ΠΥΛΑΙΑ-ΧΟΡΤΙΑΤΗΣ": ["Pylaia Municipality", "Pylaia - Chortiatis", "Municipality of Pylaia - Chortiatis", "Δήμος Πυλαίας - Χορτιάτη", "Pulaia"],
  "ΘΕΡΜΑΪΚΟΣ": ["Thermaikos Municipality", "Δήμος Θερμαϊκού", "Thermaikos"],
}

const getApiBase = () => process.env.NEXT_PUBLIC_API_URL?.trim() || "http://127.0.0.1:8000"

const regionPromises: Record<string, Promise<RegionResultsData | null> | undefined> = {}

export const useDataStore = create<DataState>((set, get) => ({
  sharedQiData: null,
  sharedQiLoading: false,

  airMapData: null,
  airMapLoading: false,

  recycleCompareData: null,
  recycleEfficiencyData: null,
  recycleLoading: false,

  regionResultsCache: {},
  regionResultsLoading: {},

  fetchSharedQi: async () => {
    const { sharedQiData, sharedQiLoading } = get()
    if (sharedQiData || sharedQiLoading) return

    set({ sharedQiLoading: true })
    try {
      const res = await fetch(`${getApiBase()}/sharedqi/areas?_ts=${Date.now()}`)
      if (res.ok) {
        const payload = await res.json()
        set({ sharedQiData: payload.areas ?? [] })
      }
    } catch (err) {
      console.error("Failed to fetch sharedQI", err)
    } finally {
      set({ sharedQiLoading: false })
    }
  },

  fetchAirMap: async () => {
    const { airMapData, airMapLoading } = get()
    if (airMapData || airMapLoading) return

    set({ airMapLoading: true })
    try {
      const areasRes = await airApi.get<AirAreasResponse>("/air/areas")
      const areaNames = areasRes.data.areas ?? []

      const settled = await Promise.allSettled(
        areaNames.map(async (area) => {
          const encoded = encodeURIComponent(area)
          const latest = await airApi.get<AirLatestMonthResponse>(`/air/area/${encoded}/latest-month`)
          return {
            area,
            aliases: AIR_AREA_ALIASES[area] ?? [],
            score: typeof latest.data?.aqi_score === "number" ? latest.data.aqi_score : null,
            label: typeof latest.data?.aqi_label === "string" ? latest.data.aqi_label : null,
          }
        })
      )

      const mapped: SharedAreaPayload[] = settled
        .map((result) => (result.status === "fulfilled" ? result.value : null))
        .filter((row): row is any => row !== null)
        .map((row) => ({
          area: row.area,
          aliases: row.aliases,
          metrics: {
            air: { aqi_raw: row.score, air_norm: null, aqi_label: row.label },
            water: { wqi_raw: null, water_norm: null, wqi_rating: null },
            eqi: { eqi_raw: null, eqi_display: null, band: null },
          },
          dominant_factor: row.score == null ? null : "air",
        }))

      set({ airMapData: mapped })
    } catch (err) {
      console.error("Failed to fetch air map data", err)
    } finally {
      set({ airMapLoading: false })
    }
  },

  fetchRecycleData: async () => {
    const { recycleCompareData, recycleLoading } = get()
    if (recycleCompareData || recycleLoading) return

    set({ recycleLoading: true })
    try {
      const base = getApiBase()
      const areasRes = await fetch(`${base}/recycling/areas`)
      const areasData = await areasRes.json()
      const latestYear = Math.max(...(areasData.years ?? [2024]))

      // Fetch per capita data
      const compareRes = await fetch(`${base}/recycling/compare?year=${latestYear}`)
      const compareData = await compareRes.json()

      const compareMapped: SharedAreaPayload[] = (compareData.comparison ?? []).map((entry: any) => ({
        area: entry.area,
        aliases: RECYCLE_TO_MAP_ALIASES[entry.area] ?? [entry.area],
        metrics: {
          air: { aqi_raw: null, air_norm: null, aqi_label: null },
          water: { wqi_raw: null, water_norm: null, wqi_rating: null },
          eqi: { eqi_raw: null, eqi_display: null, band: null },
          recycle: { score: entry.avg_kg_per_capita },
        },
        dominant_factor: null,
      }))

      // Fetch efficiency data for leaderboard
      const summaryRes = await fetch(`${base}/recycling/summary?year=${latestYear}`)
      const summaryData = await summaryRes.json()

      const effRes = await fetch(`${base}/recycling/efficiency?year=${latestYear}`)
      const effData = await effRes.json()

      const avgEff = effData.months?.length
        ? effData.months.reduce((sum: number, m: any) => sum + m.efficiency, 0) / effData.months.length
        : 0

      const efficiencyMapped: SharedAreaPayload[] = (summaryData.areas_ranking ?? []).map((entry: any) => ({
        area: entry.area,
        aliases: RECYCLE_TO_MAP_ALIASES[entry.area] ?? [entry.area],
        metrics: {
          air: { aqi_raw: null, air_norm: null, aqi_label: null },
          water: { wqi_raw: null, water_norm: null, wqi_rating: null },
          eqi: { eqi_raw: null, eqi_display: null, band: null },
          recycle: { score: Math.round(avgEff * 100) },
        },
        dominant_factor: null,
      }))

      set({
        recycleCompareData: compareMapped,
        recycleEfficiencyData: efficiencyMapped,
      })
    } catch (err) {
      console.error("Failed to fetch recycle data", err)
    } finally {
      set({ recycleLoading: false })
    }
  },

  getRegionResults: async (
    region: RegionCatalogItem
  ): Promise<RegionResultsData | null> => {
    const { regionResultsCache } = get()
    const cachedResults = regionResultsCache[region.slug] ?? null
    const pendingResults = regionPromises[region.slug]
    
    if (cachedResults) {
      return cachedResults
    }

    if (pendingResults) {
      return pendingResults
    }

    const promise = (async () => {
      set((state) => ({
        regionResultsLoading: { ...state.regionResultsLoading, [region.slug]: true }
      }))

      try {
        const data = await fetchRegionResults(region)
        set((state) => ({
          regionResultsCache: { ...state.regionResultsCache, [region.slug]: data }
        }))
        return data
      } catch (err) {
        console.error("Failed to fetch region results", err)
        return null
      } finally {
        set((state) => ({
          regionResultsLoading: { ...state.regionResultsLoading, [region.slug]: false }
        }))
        delete regionPromises[region.slug]
      }
    })()

    regionPromises[region.slug] = promise
    return promise
  }
}))
