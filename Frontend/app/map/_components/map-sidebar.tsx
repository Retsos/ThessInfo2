"use client"

import type { QualityBand } from "@/lib/quality-indexes"
import type { AreaSelection } from "../map-types"

// ── Greek labels for backend area keys ───────────────────────────────────────

const AIR_AREA_LABELS: Record<string, string> = {
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

const WATER_AREA_LABELS: Record<string, string> = {
  "40ekklisies": "40 Εκκλησιές",
  ampelokipoi: "Αμπελόκηποι",
  analipsi: "Ανάληψη",
  ano_poli: "Άνω Πόλη",
  ano_toympa: "Άνω Τούμπα",
  bipeth: "ΒΙΠΕΘ",
  "deth-hanth": "ΔΕΘ-ΧΑΝΘ",
  euosmos: "Εύοσμος",
  eykarpia: "Ευκαρπία",
  agios_paulos: "Άγιος Παύλος",
  harilaoy: "Χαριλάου",
  kalamaria: "Καλαμαριά",
  kato_toympa: "Κάτω Τούμπα",
  kentro_polis: "Κέντρο πόλης",
  konstantinoypolitika: "Κωνσταντινουπολίτικα",
  nea_paralia: "Νέα Παραλία",
  ntepo: "Ντεπώ",
  oraiokastro: "Ωραιόκαστρο",
  panagia_faneromeni: "Παναγία Φανερωμένη",
  plateia_dimokratias: "Πλ. Δημοκρατίας",
  pylaia: "Πυλαία",
  pylaia_ikea: "Πυλαία (ΙΚΕΑ)",
  sfageia: "Σφαγεία",
  sholi_tyflon: "Σχολή Τυφλών",
  triandria: "Τριανδρία",
  xirokrini: "Ξηροκρήνη",
}

const DOMINANT_LABELS: Record<string, string> = {
  air: "Ποιότητα Αέρα",
  water: "Ποιότητα Νερού",
}

const GREEK_MONTHS: Record<number, string> = {
  1: "Ιανουάριος",   2: "Φεβρουάριος",  3: "Μάρτιος",
  4: "Απρίλιος",     5: "Μάιος",        6: "Ιούνιος",
  7: "Ιούλιος",      8: "Αύγουστος",    9: "Σεπτέμβριος",
  10: "Οκτώβριος",  11: "Νοέμβριος",   12: "Δεκέμβριος",
}

function formatMonth(monthKey: string | null | undefined): string | null {
  if (!monthKey) return null
  const [yearStr, monthStr] = monthKey.split("-")
  const month = parseInt(monthStr, 10)
  const year = parseInt(yearStr, 10)
  if (isNaN(month) || isNaN(year)) return monthKey
  return `${GREEK_MONTHS[month] ?? monthStr} ${year}`
}

function airLabel(key: string | null | undefined): string {
  if (!key) return "—"
  return AIR_AREA_LABELS[key] ?? key
}

function waterLabel(key: string | null | undefined): string {
  if (!key) return "—"
  return WATER_AREA_LABELS[key] ?? key
}

// ── Component ────────────────────────────────────────────────────────────────

export function MapSidebar({
  indexCode,
  legend,
  selected,
  selectedBandLabel,
}: {
  indexCode: string
  legend: QualityBand[]
  selected: AreaSelection | null
  selectedBandLabel: string
}) {
  const src = selected?.row?.source ?? null
  const score = selected?.row?.score ?? null
  const sources = src?.sources ?? null

  const airAqi = src?.metrics.air.aqi_raw
  const airBand = src?.metrics.air.aqi_label
  const waterWqi = src?.metrics.water.wqi_raw
  const waterBand = src?.metrics.water.wqi_rating

  // Pick the latest measurement date from whichever is more recent
  const latestMeasurement = sources
    ? formatMonth(
        [sources.air_month, sources.water_month]
          .filter(Boolean)
          .sort()
          .reverse()[0]
      )
    : null

  return (
    <div className="space-y-4">
      {/* ── Κύριο πάνελ δεδομένων ───────────────────────────────── */}
      <div className="rounded-3xl border border-[#d7eff0] bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1daaad]">
          Στοιχεία Περιοχής{selected ? ` · ${selected.mapAreaName}` : ""}
        </p>

        {!selected ? (
          <p className="mt-3 text-sm leading-7 text-[#1a535c]/78">
            Κάνε click σε μια περιοχή στον χάρτη για να εμφανιστούν τα περιβαλλοντικά δεδομένα.
          </p>
        ) : (
          <div className="mt-3 space-y-2 text-sm">
            {/* Συνολικός δείκτης */}
            <div className="rounded-xl border border-teal-200 bg-teal-50/60 px-3 py-2.5 text-teal-900">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Συνολικός Δείκτης ({indexCode})</span>
                {selectedBandLabel && (
                  <span className="rounded-full bg-teal-600/15 px-2 py-0.5 text-xs font-medium text-teal-700">
                    {selectedBandLabel}
                  </span>
                )}
              </div>
              <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight">
                {typeof score === "number" ? score.toFixed(1) : "—"}
                <span className="ml-1 text-sm font-normal text-teal-700/70">/ 100</span>
              </p>
            </div>

            {/* Κυρίαρχος Παράγοντας */}
            {selected.row?.driver && (
              <p className="rounded-xl border border-[#e4f1f1] bg-[#fbfefe] px-3 py-2 text-[#1a535c]">
                <span className="font-medium">Κυρίαρχος Παράγοντας:</span>{" "}
                {DOMINANT_LABELS[selected.row.driver] ?? selected.row.driver}
              </p>
            )}

            {/* AQI */}
            <div className="rounded-xl border border-cyan-100 bg-cyan-50/40 px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-cyan-800">Δείκτης Αέρα (AQI)</span>
                {airBand && (
                  <span className="rounded-full bg-cyan-600/15 px-2 py-0.5 text-xs font-medium text-cyan-700">
                    {airBand}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-lg font-semibold tabular-nums text-cyan-900">
                {airAqi != null ? airAqi.toFixed(1) : "Χωρίς δεδομένα"}
              </p>
            </div>

            {/* WQI */}
            <div className="rounded-xl border border-sky-100 bg-sky-50/40 px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sky-800">Δείκτης Νερού (WQI)</span>
                {waterBand && (
                  <span className="rounded-full bg-sky-600/15 px-2 py-0.5 text-xs font-medium text-sky-700">
                    {waterBand}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-lg font-semibold tabular-nums text-sky-900">
                {waterWqi != null ? waterWqi.toFixed(1) : "Χωρίς δεδομένα"}
              </p>
            </div>

            {/* Τελευταία μέτρηση */}
            {latestMeasurement && (
              <p className="rounded-xl border border-[#e4f1f1] bg-[#fbfefe] px-3 py-2 text-[#1a535c]/80 text-xs">
                Τελευταία μέτρηση: <span className="font-medium">{latestMeasurement}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Πηγές Δεδομένων ─────────────────────────────────────── */}
      {selected && sources && (
        <div className="rounded-3xl border border-[#d7eff0] bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1daaad]">
            Πηγές Δεδομένων
          </p>
          <div className="mt-3 space-y-2.5 text-sm">
            <div className="rounded-xl border border-cyan-100 bg-cyan-50/30 px-3 py-2.5">
              <p className="font-medium text-cyan-800">🌬️ Σταθμός Αέρα</p>
              <p className="mt-1 text-cyan-700/85">
                Περιοχή:{" "}
                <span className="font-medium">{airLabel(sources.air_area)}</span>
              </p>
              {sources.air_month && (
                <p className="text-xs text-cyan-700/60">
                  Μέτρηση: {formatMonth(sources.air_month)}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-sky-100 bg-sky-50/30 px-3 py-2.5">
              <p className="font-medium text-sky-800">💧 Σταθμός Νερού</p>
              <p className="mt-1 text-sky-700/85">
                Περιοχή:{" "}
                <span className="font-medium">{waterLabel(sources.water_area)}</span>
              </p>
              {sources.water_month && (
                <p className="text-xs text-sky-700/60">
                  Μέτρηση: {formatMonth(sources.water_month)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Υπόμνημα ────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#d7eff0] bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1daaad]">
          Υπόμνημα ({indexCode})
        </p>
        <div className="mt-3 space-y-2">
          {legend.map((item) => (
            <div
              key={item.label}
              className={`rounded-xl border px-3 py-2 text-sm ${item.bgClass} ${item.textClass} ${item.borderClass}`}
            >
              <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
