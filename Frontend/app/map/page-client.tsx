"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import type { QualityBand } from "@/lib/quality-indexes"
import type { MapAreaRow } from "../components/map/environment-map"
import { resolveBand } from "../components/map/compute-score"
import EqiInfoModal from "./_components/eqi-info-modal"
import AqiInfoModal from "./_components/aqi-info-modal"
import WqiInfoModal from "./_components/wqi-info-modal"
import RecycleInfoModal from "./_components/recycle-info-modal"
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

import { useDataStore } from "@/lib/store/useDataStore"

export default function MapPageClient() {
  const searchParams = useSearchParams()
  const activeMetric = toMetricKey(searchParams.get("metric"))
  const config = metricConfigs[activeMetric]
  const modalContent = metricModalContent[activeMetric]

  const {
    sharedQiData,
    sharedQiLoading,
    airMapData,
    airMapLoading,
    recycleCompareData,
    recycleLoading,
    fetchSharedQi,
    fetchAirMap,
    fetchRecycleData,
  } = useDataStore()

  const [selected, setSelected] = useState<AreaSelection | null>(null)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isInfoModalOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isInfoModalOpen])

  useEffect(() => {
    setSelected(null)
    if (activeMetric === "air") {
      fetchAirMap()
    } else if (activeMetric === "recycle") {
      fetchRecycleData()
    } else {
      fetchSharedQi()
    }
  }, [activeMetric, fetchAirMap, fetchRecycleData, fetchSharedQi])

  const isLoading = 
    (activeMetric === "air" && airMapLoading) ||
    (activeMetric === "recycle" && recycleLoading) ||
    ((activeMetric === "overall" || activeMetric === "water") && sharedQiLoading)

  const areas = useMemo(() => {
    if (activeMetric === "air") return airMapData ?? []
    if (activeMetric === "recycle") return recycleCompareData ?? []
    return sharedQiData ?? []
  }, [activeMetric, airMapData, recycleCompareData, sharedQiData])

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
                  key={`environment-map-${activeMetric}`}
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
      <RecycleInfoModal open={isInfoModalOpen && activeMetric === "recycle"} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  )
}
