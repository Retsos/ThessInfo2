"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Droplets, Medal, Wind } from "lucide-react"
import {
  AQI_BANDS,
  EQI_BANDS,
  WQI_BANDS,
  getBandForScore,
  type QualityBand,
} from "@/lib/quality-indexes"

// ── Types ────────────────────────────────────────────────────────────────────

type MetricKey = "overall" | "air" | "water"

type SharedAreaPayload = {
  area: string
  aliases: string[]
  metrics: {
    air: { aqi_raw: number | null; air_norm: number | null; aqi_label: string | null }
    water: { wqi_raw: number | null; water_norm: number | null; wqi_rating: string | null }
    eqi: { eqi_raw: number | null; eqi_display: number | null; band: string | null }
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

// ── Labels ───────────────────────────────────────────────────────────────────

const AREA_LABELS: Record<string, string> = {
  Ampelokipoi: "Αμπελόκηποι",
  Chalkidonos: "Χαλκηδόνα",
  Delta: "Δέλτα",
  Kalamaria: "Καλαμαριά",
  Kordelio: "Κορδελιό-Εύοσμος",
  Lagkadas: "Λαγκαδάς",
  Neapoli: "Νεάπολη-Συκιές",
  Oraiokastro: "Ωραιόκαστρο",
  Pavlou_Mela: "Παύλου Μελά",
  Pulaia: "Πυλαία",
  Thermaikos: "Θερμαϊκός",
  Thermi: "Θέρμη",
  Thessaloniki: "Θεσσαλονίκη",
  Volvi: "Βόλβη",
}

const DOMINANT_LABELS: Record<string, string> = {
  air: "Αέρας",
  water: "Νερό",
}

// ── Config ───────────────────────────────────────────────────────────────────

const metricBands: Record<MetricKey, QualityBand[]> = {
  overall: EQI_BANDS,
  air: AQI_BANDS,
  water: WQI_BANDS,
}

const metricCode: Record<MetricKey, string> = {
  overall: "EQI",
  air: "AQI",
  water: "WQI",
}

const metricOptions: Array<{
  key: MetricKey
  label: string
  icon: typeof Wind
  color: string
}> = [
  { key: "overall", label: "Συνολική Ποιότητα", icon: Medal, color: "text-[#1a535c]" },
  { key: "air", label: "Αέρας", icon: Wind, color: "text-sky-700" },
  { key: "water", label: "Νερό", icon: Droplets, color: "text-cyan-700" },
]

const metricHeaders: Record<MetricKey, { title: string; subtitle: string }> = {
  overall: {
    title: "Κατάταξη Συνολικής Περιβαλλοντικής Ποιότητας",
    subtitle: "Βάσει του σύνθετου δείκτη EQI (70% αέρας + 30% νερό). Υψηλότερο EQI = καλύτερη ποιότητα.",
  },
  air: {
    title: "Κατάταξη Ποιότητας Αέρα",
    subtitle: "Βάσει AQI — χαμηλότερο AQI = καθαρότερος αέρας. Σειρά από τον καλύτερο προς τον χειρότερο.",
  },
  water: {
    title: "Κατάταξη Ποιότητας Νερού",
    subtitle: "Βάσει WQI — χαμηλότερο WQI = καθαρότερο νερό. Σειρά από τον καλύτερο προς τον χειρότερο.",
  },
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function toMetricKey(value: string | null): MetricKey {
  if (value === "air" || value === "water" || value === "overall") return value
  return "overall"
}

function scoreForMetric(item: SharedAreaPayload, metric: MetricKey): number | null {
  if (metric === "overall") return item.metrics.eqi.eqi_display
  if (metric === "air") return item.metrics.air.aqi_raw
  if (metric === "water") return item.metrics.water.wqi_raw
  return null
}

function badgeLabelForMetric(item: SharedAreaPayload, metric: MetricKey): string | null {
  if (metric === "overall") return item.metrics.eqi.band
  if (metric === "air") return item.metrics.air.aqi_label
  if (metric === "water") return item.metrics.water.wqi_rating
  return null
}

type RankedRow = {
  area: string
  label: string
  score: number
  badgeLabel: string | null
  dominantFactor: string | null
}

// ── Component ────────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const searchParams = useSearchParams()
  const activeMetric = toMetricKey(searchParams.get("metric"))

  const [areas, setAreas] = useState<SharedAreaPayload[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const base = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://127.0.0.1:8000"
    setIsLoading(true)

    fetch(`${base}/sharedqi/areas?_ts=${Date.now()}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("fetch failed")
        const payload = (await res.json()) as { areas?: SharedAreaPayload[] }
        setAreas(payload.areas ?? [])
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return
        setAreas([])
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [])

  const rankedRows: RankedRow[] = useMemo(() => {
    const rows = areas
      .map((item) => {
        const score = scoreForMetric(item, activeMetric)
        if (score == null) return null
        return {
          area: item.area,
          label: AREA_LABELS[item.area] ?? item.area,
          score,
          badgeLabel: badgeLabelForMetric(item, activeMetric),
          dominantFactor: item.dominant_factor,
        }
      })
      .filter((r): r is RankedRow => r !== null)

    // EQI: higher is better (sort descending)
    // AQI/WQI: lower is better (sort ascending)
    if (activeMetric === "overall") {
      rows.sort((a, b) => b.score - a.score)
    } else {
      rows.sort((a, b) => a.score - b.score)
    }

    return rows
  }, [areas, activeMetric])

  const header = metricHeaders[activeMetric]
  const bands = metricBands[activeMetric]
  const code = metricCode[activeMetric]

  // Medal colors for top 3
  const medalColors = ["text-amber-500", "text-zinc-400", "text-amber-700"]
  const medalEmojis = ["🥇", "🥈", "🥉"]

  return (
    <div className="overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#f7fdfd_38%,#ffffff_100%)]">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0f766e_0%,#1daaad_46%,#155e75_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.13),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.10),transparent_24%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 md:px-6 md:pb-20 md:pt-18">
          <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/95">
            🏆 Leaderboard Περιοχών
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">Κατάταξη περιοχών</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/90 md:text-lg">
            Live κατάταξη των {rankedRows.length > 0 ? rankedRows.length : ""} δήμων βάσει πραγματικών δεδομένων ποιότητας
            αέρα, νερού και του σύνθετου δείκτη EQI.
          </p>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        {/* Metric switcher */}
        <div className="rounded-3xl border border-[#d7eff0] bg-white/90 p-5 shadow-sm md:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1daaad]">Επιλογή κατάταξης</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {metricOptions.map((option) => {
              const Icon = option.icon
              const isActive = option.key === activeMetric

              return (
                <Link
                  key={option.key}
                  href={`/leaderboard?metric=${option.key}`}
                  className={[
                    "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                    isActive
                      ? "border-[#1daaad] bg-[#e9fbfb] text-[#1a535c]"
                      : "border-[#d6ecec] bg-white text-[#1a535c]/82 hover:bg-[#f4fbfb]",
                  ].join(" ")}
                >
                  <Icon className={`h-4 w-4 ${option.color}`} />
                  {option.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.95fr]">
          {/* ── Ranking table ───────────────────────────────────────── */}
          <div className="rounded-3xl border border-[#d7eff0] bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-2xl font-semibold text-[#1a535c]">{header.title}</h2>
            <p className="mt-2 text-sm leading-7 text-[#1a535c]/80">{header.subtitle}</p>

            {isLoading ? (
              <div className="mt-5 flex h-48 items-center justify-center rounded-2xl border border-[#d7eff0] bg-[#f7fcfc]">
                <p className="text-sm font-medium text-[#1a535c]/75">Φόρτωση δεδομένων...</p>
              </div>
            ) : rankedRows.length === 0 ? (
              <div className="mt-5 flex h-48 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50">
                <p className="text-sm font-medium text-rose-700">Δεν βρέθηκαν δεδομένα.</p>
              </div>
            ) : (
              <div className="mt-5 overflow-hidden rounded-2xl border border-[#dceff0]">
                {/* Header */}
                <div className="grid grid-cols-[0.4fr_1.3fr_0.5fr_1fr] bg-[#f4fbfb] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#1a535c]/75">
                  <p>#</p>
                  <p>Περιοχή</p>
                  <p>{code}</p>
                  <p>Αξιολόγηση</p>
                </div>

                {/* Rows */}
                <div className="divide-y divide-[#e6f2f2]">
                  {rankedRows.map((row, index) => {
                    const band = getBandForScore(row.score, bands)
                    const isTop3 = index < 3

                    return (
                      <div
                        key={row.area}
                        className={[
                          "grid grid-cols-[0.4fr_1.3fr_0.5fr_1fr] items-center px-4 py-3.5 text-sm text-[#1a535c]",
                          isTop3 ? "bg-[#fafefe]" : "",
                        ].join(" ")}
                      >
                        <p className="font-semibold">
                          {isTop3 ? (
                            <span className="text-base">{medalEmojis[index]}</span>
                          ) : (
                            <span className="text-[#1a535c]/60">{index + 1}</span>
                          )}
                        </p>
                        <div>
                          <p className="font-medium">{row.label}</p>
                          {activeMetric === "overall" && row.dominantFactor && (
                            <p className="text-xs text-[#1a535c]/55">
                              Κυρίαρχος: {DOMINANT_LABELS[row.dominantFactor] ?? row.dominantFactor}
                            </p>
                          )}
                        </div>
                        <p className="text-base font-bold tabular-nums">{row.score.toFixed(1)}</p>
                        <p>
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${band.bgClass} ${band.textClass} ${band.borderClass}`}
                          >
                            {row.badgeLabel ?? band.label}
                          </span>
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Stats summary */}
            {rankedRows.length > 0 && (
              <div className="rounded-3xl border border-[#d7eff0] bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1daaad]">Στατιστικά</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 px-3 py-2.5 text-center">
                    <p className="text-xs text-emerald-700/70">Καλύτερη</p>
                    <p className="mt-0.5 text-lg font-bold text-emerald-800">{rankedRows[0].score.toFixed(1)}</p>
                    <p className="text-xs font-medium text-emerald-700">{rankedRows[0].label}</p>
                  </div>
                  <div className="rounded-xl border border-rose-100 bg-rose-50/50 px-3 py-2.5 text-center">
                    <p className="text-xs text-rose-700/70">Χειρότερη</p>
                    <p className="mt-0.5 text-lg font-bold text-rose-800">
                      {rankedRows[rankedRows.length - 1].score.toFixed(1)}
                    </p>
                    <p className="text-xs font-medium text-rose-700">{rankedRows[rankedRows.length - 1].label}</p>
                  </div>
                  <div className="col-span-2 rounded-xl border border-[#e4f1f1] bg-[#fbfefe] px-3 py-2.5 text-center">
                    <p className="text-xs text-[#1a535c]/60">Μέσος Όρος</p>
                    <p className="mt-0.5 text-lg font-bold text-[#1a535c]">
                      {(rankedRows.reduce((sum, r) => sum + r.score, 0) / rankedRows.length).toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="rounded-3xl border border-[#d7eff0] bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1daaad]">Υπόμνημα ({code})</p>
              <div className="mt-3 space-y-2">
                {bands.map((band) => (
                  <div key={band.label} className={`rounded-xl border px-3 py-2 text-sm ${band.bgClass} ${band.textClass} ${band.borderClass}`}>
                    <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: band.color }} />
                    {band.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-3xl border border-[#d7eff0] bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1daaad]">Γρήγορες ενέργειες</p>
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href={`/map?metric=${activeMetric}`}
                  className="rounded-xl border border-[#d7eff0] bg-[#f7fcfc] px-3 py-2.5 text-sm font-medium text-[#1a535c] transition hover:bg-[#eef9f9]"
                >
                  🗺️ Άνοιγμα χάρτη ({metricCode[activeMetric]})
                </Link>
                <Link
                  href="/services"
                  className="rounded-xl border border-[#d7eff0] bg-[#f7fcfc] px-3 py-2.5 text-sm font-medium text-[#1a535c] transition hover:bg-[#eef9f9]"
                >
                  🔍 Αναζήτηση περιοχής
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
