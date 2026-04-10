"use client"

import type { QualityBand } from "@/lib/quality-indexes"
import type { AreaSelection } from "../map-types"
import { DataRow } from "./data-row"

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
  const selectedSource = selected?.row?.source ?? null
  const selectedScore = selected?.row?.score ?? null

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-[#d7eff0] bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1daaad]">
          Data Context {selected ? `· ${selected.mapAreaName}` : ""}
        </p>

        {!selected ? (
          <p className="mt-3 text-sm leading-7 text-[#1a535c]/78">
            Κάνε click σε περιοχή πάνω στον χάρτη για να εμφανιστούν live τα δεδομένα εδώ.
          </p>
        ) : (
          <div className="mt-3 space-y-2 text-sm">
            <DataRow label={`${indexCode}`} value={typeof selectedScore === "number" ? selectedScore.toFixed(1) : null} badge={selectedBandLabel} />
            <DataRow label="Dominant factor" value={selected.row?.driver} />
            <DataRow label="AQI" value={selectedSource?.metrics.air.aqi_raw?.toString()} badge={selectedSource?.metrics.air.aqi_label ?? undefined} />
            <DataRow label="WQI" value={selectedSource?.metrics.water.wqi_raw?.toString()} badge={selectedSource?.metrics.water.wqi_rating ?? undefined} />
            <DataRow label="EQI_display" value={selectedSource?.metrics.eqi.eqi_display?.toString()} badge={selectedSource?.metrics.eqi.band ?? undefined} />
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-[#d7eff0] bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1daaad]">Legend ({indexCode})</p>
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

