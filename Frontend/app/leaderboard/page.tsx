import Link from "next/link"
import { Droplets, Medal, Recycle, Wind } from "lucide-react"
import {
  AQI_BANDS,
  EQI_BANDS,
  WQI_BANDS,
  getBandForScore,
  type QualityBand,
} from "@/lib/quality-indexes"

type SearchParams = {
  metric?: string | string[]
}

type MetricKey = "overall" | "air" | "water" | "recycle"

const RECYCLE_BANDS: QualityBand[] = [
  {
    min: 80,
    max: 100,
    label: "80-100 Outstanding",
    color: "#15803d",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-800",
    borderClass: "border-emerald-200",
  },
  {
    min: 60,
    max: 79.99,
    label: "60-79 Good",
    color: "#22c55e",
    bgClass: "bg-green-50",
    textClass: "text-green-800",
    borderClass: "border-green-200",
  },
  {
    min: 40,
    max: 59.99,
    label: "40-59 Needs Improvement",
    color: "#f59e0b",
    bgClass: "bg-amber-50",
    textClass: "text-amber-800",
    borderClass: "border-amber-200",
  },
  {
    min: 0,
    max: 39.99,
    label: "0-39 Low Coverage",
    color: "#ef4444",
    bgClass: "bg-rose-50",
    textClass: "text-rose-800",
    borderClass: "border-rose-200",
  },
]

const metricBands: Record<MetricKey, QualityBand[]> = {
  overall: EQI_BANDS,
  air: AQI_BANDS,
  water: WQI_BANDS,
  recycle: RECYCLE_BANDS,
}

const metricCode: Record<MetricKey, string> = {
  overall: "EQI",
  air: "AQI",
  water: "WQI",
  recycle: "RCY%",
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
  { key: "recycle", label: "Ανακύκλωση", icon: Recycle, color: "text-emerald-700" },
]

const leaderboardData: Record<MetricKey, Array<{ area: string; score: number; delta: string }>> = {
  overall: [
    { area: "Καλαμαριά", score: 87, delta: "+2.1" },
    { area: "Τούμπα", score: 84, delta: "+1.3" },
    { area: "Χαριλάου", score: 80, delta: "-0.4" },
    { area: "Κέντρο", score: 76, delta: "+0.6" },
    { area: "Σταυρούπολη", score: 73, delta: "+1.0" },
  ],
  air: [
    { area: "Πυλαία", score: 89, delta: "+0.8" },
    { area: "Καλαμαριά", score: 85, delta: "+1.9" },
    { area: "Τούμπα", score: 82, delta: "+0.2" },
    { area: "Κέντρο", score: 74, delta: "-1.1" },
    { area: "Συκιές", score: 70, delta: "+0.5" },
  ],
  water: [
    { area: "Πανόραμα", score: 91, delta: "+0.4" },
    { area: "Καλαμαριά", score: 88, delta: "+1.1" },
    { area: "Τούμπα", score: 83, delta: "+0.7" },
    { area: "Χαριλάου", score: 79, delta: "-0.2" },
    { area: "Κέντρο", score: 75, delta: "+0.3" },
  ],
  recycle: [
    { area: "Εύοσμος", score: 86, delta: "+2.8" },
    { area: "Σταυρούπολη", score: 84, delta: "+1.5" },
    { area: "Καλαμαριά", score: 80, delta: "+0.9" },
    { area: "Τούμπα", score: 77, delta: "-0.3" },
    { area: "Κέντρο", score: 71, delta: "+0.1" },
  ],
}

const metricHeaders: Record<MetricKey, { title: string; subtitle: string }> = {
  overall: {
    title: "Κατάταξη συνολικής περιβαλλοντικής ποιότητας",
    subtitle: "EQI-based ranking με κοινή κλίμακα χρωμάτων.",
  },
  air: {
    title: "Κατάταξη ποιότητας αέρα",
    subtitle: "AQI-based ranking με shared thresholds.",
  },
  water: {
    title: "Κατάταξη ποιότητας νερού",
    subtitle: "WQI-based ranking με shared thresholds.",
  },
  recycle: {
    title: "Κατάταξη ανακύκλωσης",
    subtitle: "Placeholder ranking για ποσοστό ανακύκλωσης.",
  },
}

function toMetricKey(metric: string | string[] | undefined): MetricKey {
  const raw = Array.isArray(metric) ? metric[0] : metric
  if (raw === "air" || raw === "water" || raw === "recycle" || raw === "overall") {
    return raw
  }
  return "overall"
}

export default function LeaderboardPage({
  searchParams,
}: {
  searchParams?: SearchParams
}) {
  const activeMetric = toMetricKey(searchParams?.metric)
  const rows = leaderboardData[activeMetric]
  const header = metricHeaders[activeMetric]
  const bands = metricBands[activeMetric]
  const code = metricCode[activeMetric]

  return (
    <div className="overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#f7fdfd_38%,#ffffff_100%)]">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0f766e_0%,#1daaad_46%,#155e75_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.13),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.10),transparent_24%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 md:px-6 md:pb-20 md:pt-18">
          <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/95">
            Leaderboard Περιοχών
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">Κατάταξη περιοχών</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/90 md:text-lg">
            Κοινό quality-index setup με τα ίδια thresholds και χρώματα που χρησιμοποιούμε και στο map.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="rounded-3xl border border-[#d7eff0] bg-white/90 p-5 shadow-sm md:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1daaad]">Επιλογή leaderboard</p>
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
          <div className="rounded-3xl border border-[#d7eff0] bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-2xl font-semibold text-[#1a535c]">{header.title}</h2>
            <p className="mt-2 text-sm leading-7 text-[#1a535c]/80">{header.subtitle}</p>

            <div className="mt-5 overflow-hidden rounded-2xl border border-[#dceff0]">
              <div className="grid grid-cols-[0.45fr_1.2fr_0.55fr_0.95fr_0.5fr] bg-[#f4fbfb] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#1a535c]/75">
                <p>#</p>
                <p>Περιοχή</p>
                <p>{code}</p>
                <p>Band</p>
                <p>Δ</p>
              </div>

              <div className="divide-y divide-[#e6f2f2]">
                {rows.map((row, index) => {
                  const band = getBandForScore(row.score, bands)
                  return (
                    <div
                      key={row.area}
                      className="grid grid-cols-[0.45fr_1.2fr_0.55fr_0.95fr_0.5fr] items-center px-4 py-3 text-sm text-[#1a535c]"
                    >
                      <p className="font-semibold">{index + 1}</p>
                      <p>{row.area}</p>
                      <p className="font-semibold">{row.score}</p>
                      <p>
                        <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${band.bgClass} ${band.textClass} ${band.borderClass}`}>
                          {band.label}
                        </span>
                      </p>
                      <p className={row.delta.startsWith("-") ? "text-rose-600" : "text-emerald-600"}>{row.delta}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-[#d7eff0] bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1daaad]">Legend ({code})</p>
              <div className="mt-3 space-y-2">
                {bands.map((band) => (
                  <div key={band.label} className={`rounded-xl border px-3 py-2 text-sm ${band.bgClass} ${band.textClass} ${band.borderClass}`}>
                    <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: band.color }} />
                    {band.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#d7eff0] bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1daaad]">Quick actions</p>
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href={`/map?metric=${activeMetric}`}
                  className="rounded-xl border border-[#d7eff0] bg-[#f7fcfc] px-3 py-2 text-sm font-medium text-[#1a535c] hover:bg-[#eef9f9]"
                >
                  Άνοιγμα χάρτη με ίδιο metric
                </Link>
                <Link
                  href="/services"
                  className="rounded-xl border border-[#d7eff0] bg-[#f7fcfc] px-3 py-2 text-sm font-medium text-[#1a535c] hover:bg-[#eef9f9]"
                >
                  Αναζήτηση περιοχής
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
