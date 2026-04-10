import type { Feature, GeoJsonProperties, Geometry } from "geojson"
import { normalizeText } from "./normalize"

export type MapAreaRow = {
    /** Stable backend identifier (used for ID-based matching if present) */
    id?: string
    area: string
    aliases?: string[]
    score: number | null
    driver: string | null
}

type AreaFeature = Feature<Geometry, GeoJsonProperties>

/**
 * Returns the candidate display names for a GeoJSON feature, in priority order.
 * Falls back to "Περιοχή" only when nothing else is available.
 */
export function getFeatureNames(feature: AreaFeature): string[] {
    const names: string[] = []
    const { name, name_en } = feature.properties ?? {}
    if (typeof name === "string" && name.length > 0) names.push(name)
    if (typeof name_en === "string" && name_en.length > 0) names.push(name_en)
    if (names.length === 0) names.push("Περιοχή")
    return names
}

/**
 * Finds the matching row for a GeoJSON feature.
 *
 * Strategy (in priority order):
 *  1. ID-based match — if the GeoJSON feature has a `ref` property that matches
 *     `row.id`, we trust it unconditionally (no string fuzzing needed).
 *  2. Exact normalised equality — both sides are normalised and compared with `===`.
 *     This avoids the false-positive substring matches of the old implementation.
 *
 * If you need fuzzy matching for edge cases, add it as a final fallback *after*
 * the exact pass so exact hits always win.
 */
export function matchRowForArea(
    feature: AreaFeature,
    rows: MapAreaRow[]
): MapAreaRow | undefined {
    // 1. ID-based (zero string ambiguity)
    const featureRef = feature.properties?.ref as string | undefined
    if (featureRef) {
        const byId = rows.find((r) => r.id === featureRef)
        if (byId) return byId
    }

    // 2. Exact normalised match
    const featureNames = getFeatureNames(feature).map(normalizeText)

    return rows.find((row) => {
        const aliases = [row.area, ...(row.aliases ?? [])].map(normalizeText)
        return featureNames.some((fn) => aliases.some((alias) => fn === alias))
    })
}