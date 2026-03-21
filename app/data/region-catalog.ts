import { regions as legacyRegions } from "./legacy-regions"

type LegacyRegion = {
    value: string
    label: string
    RecycleName?: string
    airName?: string
    tooltip1?: string
    tooltip2?: string
    tooltip3?: string
}

export type RegionCatalogItem = {
    slug: string
    label: string
    searchValue: string
    keys: {
        water: string | null
        recycle: string | null
        air: string | null
    }
    availability: {
        water: boolean
        recycle: boolean
        air: boolean
    }
}

function slugifyGreek(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\u0370-\u03ff\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
}

function isRealKey(value?: string | null) {
    return Boolean(value && value.trim() !== "" && value !== "a")
}

export const regionCatalog: RegionCatalogItem[] = (legacyRegions as LegacyRegion[])
    .map((region) => {
        const waterKey = region.tooltip1 ? region.label : null
        const recycleKey = isRealKey(region.RecycleName) ? region.RecycleName!.trim() : null
        const airKey = isRealKey(region.airName) ? region.airName!.trim() : null

        return {
            slug: slugifyGreek(region.label),
            label: region.label,
            searchValue: region.label,
            keys: {
                water: waterKey,
                recycle: recycleKey,
                air: airKey,
            },
            availability: {
                water: Boolean(waterKey),
                recycle: Boolean(recycleKey),
                air: Boolean(airKey),
            },
        }
    })
    .sort((a, b) => a.label.localeCompare(b.label, "el", { sensitivity: "base" }))

export function getRegionByLabel(label: string) {
    return regionCatalog.find((region) => region.label === label) ?? null
}

export function getRegionBySlug(slug: string) {
    return regionCatalog.find((region) => region.slug === slug) ?? null
}

export function normalizeText(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
}