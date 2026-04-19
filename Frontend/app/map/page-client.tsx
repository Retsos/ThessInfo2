"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import type { QualityBand } from "@/lib/quality-indexes"
import airApi from "@/lib/api2"
import type { MapAreaRow } from "../components/map/environment-map"
import { resolveBand } from "../components/map/compute-score"
import EqiInfoModal from "./_components/eqi-info-modal"
import AqiInfoModal from "./_components/aqi-info-modal"
import WqiInfoModal from "./_components/wqi-info-modal"
import { InfoModal } from "./_components/info-modal"
import { MetricSwitcher } from "./_components/metric-switcher"
import { MapSidebar } from "./_components/map-sidebar"
import { metricConfigs, metricModalContent } from "./map-metrics"
import type { AreaSelection, MetricKey, SharedAreaPayload } from "./map-types"

const EnvironmentMap = dynamic(
  () => import("../components/map/environment-map").then((m) => m.EnvironmentMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-2xl border border-[#d7eff0] bg-[#f7fcfc]">
        <p className="text-sm font-medium text-[#1a535c]/75">Φόρτωση χάρτη...</p>
      </div>
    ),
  }
)

function toMetricKey(value: string | null): MetricKey {
  if (value === "air" || value === "water" || value === "recycle" || value === "overall") return value
  return "overall"
}

function scoreByMetric(item: SharedAreaPayload, metric: MetricKey): number | null {
  if (metric === "overall") return item.metrics.eqi.eqi_display
  if (metric === "air") return item.metrics.air.aqi_raw
  if (metric === "water") return item.metrics.water.wqi_raw
  if (metric === "recycle") return item.metrics.recycle?.score ?? null
  return null
}

function driverByMetric(item: SharedAreaPayload, metric: MetricKey): string | null {
  if (metric === "overall") return item.dominant_factor
  if (metric === "air") return item.metrics.air.aqi_label
  if (metric === "water") return item.metrics.water.wqi_rating
  return null
}

const AIR_AREA_ALIASES: Record<string, string[]> = {
  Ampelokipoi: [
    "Ampelokipoi Municipality",
    "Ampelokipi - Menemeni Municipality",
    "Δήμος Αμπελοκήπων - Μενεμένης",
  ],
  Chalkidonos: [
    "Chalkidona Municipality",
    "Δήμος Χαλκηδόνας",
  ],
  Delta: [
    "Delta Municipality",
    "Δήμος Δέλτα",
  ],
  Kalamaria: [
    "Kalamaria Municipality",
    "Δήμος Καλαμαριάς",
  ],
  Kordelio: [
    "Kordelio Municipality",
    "Evosmos Municipality",
    "Kordelio-Evosmos Municipality",
    "Kordelio - Evosmos Municipality",
    "Δήμος Κορδελιού - Ευόσμου",
  ],
  Lagkadas: [
    "Lagkadas Municipality",
    "Municipality of Lagadas",
    "Lagadas",
    "Δήμος Λαγκαδά",
  ],
  Neapoli: [
    "Neapoli Municipality",
    "Neapolis-Sykeon Municipality",
    "Municipality of Neapoli-Sykies",
    "Δήμος Νεάπολης - Συκεών",
  ],
  Oraiokastro: [
    "Oreokastro Municipality",
    "Oraiokastro Municipality",
    "Δήμος Ωραιοκάστρου",
  ],
  Pavlou_Mela: [
    "Pavlou Mela Municipality",
    "Pavlos Melas Municipality",
    "Δήμος Παύλου Μελά",
  ],
  Pulaia: [
    "Pylaia Municipality",
    "Pulaia Municipality",
    "Municipality of Pylaia - Chortiatis",
    "Pylaia - Chortiatis",
    "Δήμος Πυλαίας - Χορτιάτη",
  ],
  Thermaikos: [
    "Thermaikos Municipality",
    "Δήμος Θερμαϊκού",
  ],
  Thermi: [
    "Thermi Municipality",
    "Δήμος Θέρμης",
  ],
  Thessaloniki: [
    "Thessaloniki Municipality",
    "Municipality of Thessaloniki",
    "Δήμος Θεσσαλονίκης",
  ],
  Volvi: [
    "Volvi Municipality",
    "Δήμος Βόλβης",
  ],
}

type AirAreasResponse = { areas?: string[] }
type AirLatestMonthResponse = {
  aqi_score?: number | null
  aqi_label?: string | null
}
type AirMapRow = {
  area: string
  aliases: string[]
  score: number | null
  label: string | null
}

export default function MapPageClient() {
  const searchParams = useSearchParams()
  const activeMetric = toMetricKey(searchParams.get("metric"))
  const config = metricConfigs[activeMetric]
  const modalContent = metricModalContent[activeMetric]

  const [areas, setAreas] = useState<SharedAreaPayload[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState<AreaSelection | null>(null)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [dataVersion, setDataVersion] = useState(0)

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isInfoModalOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isInfoModalOpen])

  useEffect(() => {
    const controller = new AbortController()
    const base = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://127.0.0.1:8000"
    setIsLoading(true)
    setSelected(null)

    const load = async () => {
      try {
        if (activeMetric === "air") {
          const areasRes = await airApi.get<AirAreasResponse>("/air/areas", { signal: controller.signal })
          const areaNames = areasRes.data.areas ?? []

          const settled = await Promise.allSettled(
            areaNames.map(async (area) => {
              const encoded = encodeURIComponent(area)
              const latest = await airApi.get<AirLatestMonthResponse>(`/air/area/${encoded}/latest-month`, {
                signal: controller.signal,
              })
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
            .filter((row): row is AirMapRow => row !== null)
            .map((row) => ({
              area: row.area,
              aliases: row.aliases,
              metrics: {
                air: {
                  aqi_raw: row.score,
                  air_norm: null,
                  aqi_label: row.label,
                },
                water: {
                  wqi_raw: null,
                  water_norm: null,
                  wqi_rating: null,
                },
                eqi: {
                  eqi_raw: null,
                  eqi_display: null,
                  band: null,
                },
              },
              dominant_factor: row.score == null ? null : "air",
            }))

          console.log("[Map][air] loaded from results source", {
            metric: activeMetric,
            totalAreas: mapped.length,
            sample: mapped[0] ?? null,
          })
          setAreas(mapped)
        } else if (activeMetric === "recycle") {
          const areasRes = await fetch(`${base}/recycling/areas`, { signal: controller.signal })
          const areasData = await areasRes.json()
          const latestYear = Math.max(...(areasData.years ?? [2024]))

          const compareRes = await fetch(`${base}/recycling/compare?year=${latestYear}`, { signal: controller.signal })
          const compareData = await compareRes.json()
          
          const RECYCLE_TO_MAP_ALIASES: Record<string, string[]> = {
            "ΘΕΡΜΗ": ["Thermi Municipality", "Δήμος Θέρμης", "Thermi"],
            "ΚΑΛΑΜΑΡΙΑ": ["Kalamaria Municipality", "Δήμος Καλαμαριάς", "Kalamaria"],
            "ΠΥΛΑΙΑ-ΧΟΡΤΙΑΤΗΣ": ["Pylaia Municipality", "Pylaia - Chortiatis", "Municipality of Pylaia - Chortiatis", "Δήμος Πυλαίας - Χορτιάτη", "Pulaia"],
            "ΘΕΡΜΑΪΚΟΣ": ["Thermaikos Municipality", "Δήμος Θερμαϊκού", "Thermaikos"],
          }

          const mapped: SharedAreaPayload[] = (compareData.comparison ?? []).map((entry: any) => ({
            area: entry.area,
            aliases: RECYCLE_TO_MAP_ALIASES[entry.area] ?? [entry.area],
            metrics: {
              air: { aqi_raw: null, air_norm: null, aqi_label: null },
              water: { wqi_raw: null, water_norm: null, wqi_rating: null },
              eqi: { eqi_raw: null, eqi_display: null, band: null },
              recycle: { score: entry.avg_kg_per_capita }
            },
            dominant_factor: null
          }))

          console.log("[Map][recycle] loaded", { totalAreas: mapped.length })
          setAreas(mapped)
        } else {
          const res = await fetch(`${base}/sharedqi/areas?metric=${activeMetric}&_ts=${Date.now()}`, {
            signal: controller.signal,
            cache: "no-store",
          })
          if (!res.ok) throw new Error("sharedqi fetch failed")
          const payload = (await res.json()) as { areas?: SharedAreaPayload[] }
          const mapped = payload.areas ?? []
          console.log("[Map][sharedqi] loaded", {
            metric: activeMetric,
            totalAreas: mapped.length,
            sample: mapped[0] ?? null,
          })
          setAreas(mapped)
        }
        setDataVersion((value) => value + 1)
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return
        setAreas([])
        setDataVersion((value) => value + 1)
        console.log("[Map] load error", { metric: activeMetric, error })
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    void load()

    return () => controller.abort()
  }, [activeMetric])

  const rows: Array<MapAreaRow & { source?: SharedAreaPayload }> = useMemo(
    () =>
      areas.map((item) => ({
        area: item.area,
        aliases: item.aliases,
        score: scoreByMetric(item, activeMetric),
        driver: driverByMetric(item, activeMetric),
        source: item,
      })),
    [activeMetric, areas]
  )

  const selectedScore = selected?.row?.score ?? null
  const selectedBandLabel = resolveBand(selectedScore, config.legend)?.label ?? "No data"

  return (
    <div className="overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#f7fdfd_38%,#ffffff_100%)]">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#2c999b_0%,#1daaad_44%,#006264_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_24%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 md:px-6 md:pb-20 md:pt-18">
          <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/95">
            Χάρτης Περιβαλλοντικών Δεδομένων
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Διαδραστικός χάρτης περιοχών
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/90 md:text-lg">
            Click σε περιοχή για live data context με πραγματικά AQI/WQI/EQI.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="rounded-3xl border border-[#d7eff0] bg-white/90 p-5 shadow-sm md:p-6">
          <MetricSwitcher
            activeMetric={activeMetric}
            infoButtonLabel={modalContent.button}
            onOpenInfo={() => setIsInfoModalOpen(true)}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-3xl border border-[#d7eff0] bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-2xl font-semibold text-[#1a535c]">{config.title}</h2>
            <p className="mt-2 text-sm leading-7 text-[#1a535c]/80">{config.hint}</p>

            <div className="mt-5">
              {isLoading ? (
                <div className="flex h-[420px] items-center justify-center rounded-2xl border border-[#d7eff0] bg-[#f7fcfc]">
                  <p className="text-sm font-medium text-[#1a535c]/75">Φόρτωση δεδομένων...</p>
                </div>
              ) : (
                <EnvironmentMap
                  key={`environment-map-${activeMetric}-${dataVersion}`}
                  metric={activeMetric}
                  indexCode={config.indexCode}
                  rows={rows}
                  legend={config.legend as QualityBand[]}
                  onAreaSelect={(payload) => setSelected(payload as AreaSelection)}
                />
              )}
            </div>
          </div>

          <MapSidebar indexCode={config.indexCode} legend={config.legend} selected={selected} selectedBandLabel={selectedBandLabel} />
        </div>
        {/* Leaderboards CTA */}
        <Link
          href="/leaderboard"
          className="group mt-6 flex items-center justify-between rounded-3xl border border-[#d7eff0] bg-white p-5 shadow-sm transition hover:border-[#1daaad]/40 hover:shadow-md md:p-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-2xl shadow-sm">
              🏆
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#1a535c] group-hover:text-[#1daaad] transition">
                Leaderboards Περιοχών
              </h3>
              <p className="text-sm text-[#1a535c]/65">
                Δες ποιες περιοχές έχουν την καλύτερη & χειρότερη ποιότητα αέρα, νερού και συνολικά.
              </p>
            </div>
          </div>
          <span className="mr-1 text-xl text-[#1a535c]/40 transition group-hover:translate-x-1 group-hover:text-[#1daaad]">
            →
          </span>
        </Link>
      </section>

      <EqiInfoModal open={isInfoModalOpen && activeMetric === "overall"} onClose={() => setIsInfoModalOpen(false)} />
      <AqiInfoModal open={isInfoModalOpen && activeMetric === "air"} onClose={() => setIsInfoModalOpen(false)} />
      <WqiInfoModal open={isInfoModalOpen && activeMetric === "water"} onClose={() => setIsInfoModalOpen(false)} />
      
      {activeMetric === "recycle" && (
        <InfoModal
          open={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          title={modalContent.title}
          body={modalContent.placeholder}
        />
      )}
    </div>
  )
}
