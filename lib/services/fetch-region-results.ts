import api from "@/lib/api"
import type { RegionCatalogItem } from "../../app/data/region-catalog"
import type {
    WaterLatestResponse,
    WaterYearlyResponse,
} from "../../app/components/results/water/water-types"

export type RegionResultsData = {
    water: {
        latest: WaterLatestResponse | null
        yearly: WaterYearlyResponse | null
    }
    recycle: {
        ota: unknown | null
        perPerson: unknown | null
        usableGeneral: unknown | null
    }
    air: {
        latest: unknown | null
        yearly: unknown | null
    }
}

export async function fetchRegionResults(
    region: RegionCatalogItem
): Promise<RegionResultsData> {
    const waterKey = region.keys.water
    const recycleKey = region.keys.recycle
    const airKey = region.keys.air

    const calls = [
        airKey
            ? api.get(`airquality/area/${encodeURIComponent(airKey)}/latest-measurements/`)
            : Promise.resolve(null),
        airKey
            ? api.get(`airquality/area/${encodeURIComponent(airKey)}/group-by-year/`)
            : Promise.resolve(null),
        waterKey
            ? api.get(`water/api/latest-measurements/?region=${encodeURIComponent(waterKey)}`)
            : Promise.resolve(null),
        waterKey
            ? api.get(`water/api/group-by-year/?region=${encodeURIComponent(waterKey)}`)
            : Promise.resolve(null),
        recycleKey
            ? api.get(`recycle/recycling-ota/?region=${encodeURIComponent(recycleKey)}`)
            : Promise.resolve(null),
        recycleKey
            ? api.get(`recycle/recycling-perperson/?region=${encodeURIComponent(recycleKey)}&year=24`)
            : Promise.resolve(null),
        recycleKey ? api.get(`recycle/recycling-good/`) : Promise.resolve(null),
    ]

    const results = await Promise.allSettled(calls)

    let recycleUsableGeneral: unknown | null = null

    if (
        results[6].status === "fulfilled" &&
        results[6].value &&
        typeof results[6].value === "object" &&
        "data" in results[6].value
    ) {
        const payload = results[6].value as {
            data?: { results?: Record<string, unknown> }
        }

        const allGood = payload.data?.results || {}
        const yearKeys = Object.keys(allGood).filter((k) => /^\d+$/.test(k))

        if (yearKeys.length) {
            const latestYearKey = yearKeys
                .map((k) => parseInt(k, 10))
                .sort((a, b) => b - a)[0]
                .toString()

            recycleUsableGeneral =
                (allGood as Record<string, unknown>)[latestYearKey] ?? null
        }
    }

    return {
        water: {
            latest:
                results[2].status === "fulfilled" && results[2].value
                    ? (results[2].value as { data: WaterLatestResponse }).data
                    : null,
            yearly:
                results[3].status === "fulfilled" && results[3].value
                    ? (results[3].value as { data: WaterYearlyResponse }).data
                    : null,
        },
        recycle: {
            ota:
                results[4].status === "fulfilled" && results[4].value
                    ? (results[4].value as { data: unknown }).data
                    : null,
            perPerson:
                results[5].status === "fulfilled" && results[5].value
                    ? (results[5].value as { data: unknown }).data
                    : null,
            usableGeneral: recycleUsableGeneral,
        },
        air: {
            latest:
                results[0].status === "fulfilled" && results[0].value
                    ? (results[0].value as { data: unknown }).data
                    : null,
            yearly:
                results[1].status === "fulfilled" && results[1].value
                    ? (results[1].value as { data: unknown }).data
                    : null,
        },
    }
}
