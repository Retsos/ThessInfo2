import { regions as legacyRegions } from "./../../data/legacy-regions"

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

function isRealKey(value?: string | null) {
    return Boolean(value && value.trim() !== "" && value !== "a")
}

export const regionCatalog: RegionCatalogItem[] = (legacyRegions as LegacyRegion[])
    .map((region) => {
        const waterKey = region.tooltip1 ? region.label : null
        const recycleKey = isRealKey(region.RecycleName) ? region.RecycleName!.trim() : null
        const airKey = isRealKey(region.airName) ? region.airName!.trim() : null

        return {
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

export function normalizeText(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
}