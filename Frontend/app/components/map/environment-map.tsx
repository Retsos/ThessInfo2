"use client"

import { useEffect, useRef, useState } from "react"
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson"
import L from "leaflet"
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet"
import type { QualityBand } from "@/lib/quality-indexes"
import { getFeatureNames, matchRowForArea, type MapAreaRow } from "./match-area"
import { resolveBand } from "./compute-score"

export type { MapAreaRow }

type MetricKey = "overall" | "air" | "water" | "recycle"

type EnvironmentMapProps = {
  metric: MetricKey
  indexCode: string
  rows: MapAreaRow[]
  legend: QualityBand[]
  onAreaSelect?: (payload: { row: MapAreaRow | null; mapAreaName: string }) => void
}

// ---------------------------------------------------------------------------
// What onEachFeature needs to read on every hover — kept in a ref so that
// Leaflet handlers always see the *current* props, not a stale closure.
// ---------------------------------------------------------------------------
type LiveProps = {
  rows: MapAreaRow[]
  legend: QualityBand[]
  indexCode: string
  onAreaSelect?: EnvironmentMapProps["onAreaSelect"]
}

// ---------------------------------------------------------------------------
// FitToGeoJson – runs once after the first valid GeoJSON load
// ---------------------------------------------------------------------------
function FitToGeoJson({ data }: { data: FeatureCollection<Geometry, GeoJsonProperties> }) {
  const map = useMap()
  const hasFitted = useRef(false)

  useEffect(() => {
    if (hasFitted.current) return
    const layer = L.geoJSON(data)
    const bounds = layer.getBounds()
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [18, 18] })
      hasFitted.current = true
    }
  }, [data, map])

  return null
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function EnvironmentMap({ metric, indexCode, rows, legend, onAreaSelect }: EnvironmentMapProps) {
  const [geoData, setGeoData] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(null)
  const [isLoadingGeo, setIsLoadingGeo] = useState(true)

  // ── Live-props ref ─────────────────────────────────────────────────────────
  // Leaflet event handlers are registered once (in onEachFeature) and never
  // re-registered when props change. A plain ref that we keep in sync solves
  // the stale-closure problem without remounting the map.
  const liveRef = useRef<LiveProps>({ rows, legend, indexCode, onAreaSelect })
  useEffect(() => {
    liveRef.current = { rows, legend, indexCode, onAreaSelect }
  }, [rows, legend, indexCode, onAreaSelect])

  useEffect(() => {
    fetch("/api/geojson")
      .then(async (res) => {
        if (!res.ok) throw new Error("GeoJSON request failed")
        const payload = (await res.json()) as FeatureCollection<Geometry, GeoJsonProperties>
        setGeoData(payload)
      })
      .catch(() => setGeoData(null))
      .finally(() => setIsLoadingGeo(false))
  }, [])

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoadingGeo) {
    return (
      <div className="rounded-2xl border border-[#cfe7e8] bg-white/90 p-4 md:p-5">
        <div className="flex h-[360px] items-center justify-center rounded-xl border border-[#d7eff0] bg-[#f5fbfb]">
          <p className="text-sm font-medium text-[#1a535c]/80">Φόρτωση χάρτη...</p>
        </div>
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (!geoData) {
    return (
      <div className="rounded-2xl border border-[#cfe7e8] bg-white/90 p-4 md:p-5">
        <div className="flex h-[360px] items-center justify-center rounded-xl border border-rose-200 bg-rose-50">
          <p className="text-sm font-medium text-rose-700">Αδυναμία φόρτωσης GeoJSON</p>
        </div>
      </div>
    )
  }

  // ── Map ───────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-[#cfe7e8] bg-white/90 p-4 md:p-5">
      <div className="h-[360px] overflow-hidden rounded-xl border border-[#d7eff0] md:h-[420px]">
        {/* MapContainer has NO key — we never destroy the Leaflet instance */}
        <MapContainer center={[40.63, 22.95]} zoom={11} minZoom={9} maxZoom={13} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitToGeoJson data={geoData} />

          {/*
           * GeoJSON is keyed only by metric so it remounts (and re-runs style +
           * onEachFeature) on metric change. Colours update correctly.
           * Tooltip content is NOT pre-computed here — it is built fresh on
           * every mouseover from liveRef, so it always reflects current rows.
           */}
          <GeoJSON
            key={`geojson-${metric}`}
            data={geoData}
            style={(feature: any) => {
              if (!feature) return {}
              const { rows: r, legend: l } = liveRef.current
              const row = matchRowForArea(feature as Feature<Geometry, GeoJsonProperties>, r)
              const band = resolveBand(row?.score ?? null, l)
              return {
                fillColor: band?.color ?? "#d1d5db",
                weight: 1,
                opacity: 1,
                color: "#ffffff",
                dashArray: "3",
                fillOpacity: 0.72,
              }
            }}
            onEachFeature={(feature: any, layer: any) => {
              // Only stable, feature-level data is captured in this closure.
              // Everything that can change with the metric is read from liveRef
              // at event time, so it is always fresh.
              const featureNames = getFeatureNames(feature as Feature<Geometry, GeoJsonProperties>)
              const mapAreaName = featureNames[0]

              // Bind an empty tooltip once; content is set on every mouseover.
              layer.bindTooltip("", { sticky: true })

              layer.on({
                // ── TOOLTIP FIX ──────────────────────────────────────────────
                // Build tooltip content inside mouseover using liveRef so it
                // always reflects the *current* metric / rows / indexCode.
                // A tooltip bound at onEachFeature time would freeze the data
                // from the mount render and show stale values after metric switch.
                mouseover: (e: any) => {
                  const { rows: r, legend: l, indexCode: code } = liveRef.current
                  const row   = matchRowForArea(feature as Feature<Geometry, GeoJsonProperties>, r)
                  const score = row?.score ?? null
                  const band  = resolveBand(score, l)
                  const driver = row?.driver ?? "Model-estimated"

                  const content =
                    score === null
                      ? `<strong>${mapAreaName}</strong><br/>${code}: No data`
                      : `<strong>${mapAreaName}</strong><br/>${code}: ${score.toFixed(1)} (${band?.label ?? "Unknown"})<br/>${driver}`

                  e.target.getTooltip()?.setContent(content)

                  e.target.setStyle({ weight: 2.6, color: "#0f766e", dashArray: "", fillOpacity: 0.85 })
                  e.target.bringToFront()
                },

                mouseout: (e: any) => {
                  e.target.setStyle({ weight: 1, color: "#ffffff", dashArray: "3", fillOpacity: 0.72 })
                },

                click: () => {
                  const { rows: r, onAreaSelect: cb } = liveRef.current
                  const row = matchRowForArea(feature as Feature<Geometry, GeoJsonProperties>, r)
                  cb?.({ row: row ?? null, mapAreaName })
                },
              })
            }}
          />
        </MapContainer>
      </div>
    </div>
  )
}
