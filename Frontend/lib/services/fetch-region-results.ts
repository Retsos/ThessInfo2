import api from "@/lib/api"
import type { RegionCatalogItem } from "../../app/data/region-catalog"
import type { AirResultsData } from "../../app/components/results/air/air-types"
import type { WaterTabData } from "../../app/components/results/water/water-types"
import { fetchWaterResults } from "./fetch-water-results"
import { fetchAirResults } from "./fetch-air-results"

export type RegionResultsData = {
    water: WaterTabData | null
    recycle: {
        ota: unknown | null
        perPerson: unknown | null
        usableGeneral: unknown | null
    }
    air: {
        data: AirResultsData | null
    }
}

function extractData<T>(result: PromiseSettledResult<unknown>): T | null {
    if (
        result.status === "fulfilled" &&
        result.value &&
        typeof result.value === "object" &&
        "data" in result.value
    ) {
        return (result.value as { data: T }).data
    }

    return null
}

export async function fetchRegionResults(
    region: RegionCatalogItem
): Promise<RegionResultsData> {
    const waterKey = region.keys.water
    const recycleKey = region.keys.recycle
    const airKey = region.keys.air

    const calls = [
        airKey ? fetchAirResults(airKey) : Promise.resolve(null),
        recycleKey
            ? api.get(`recycle/recycling-ota/?region=${encodeURIComponent(recycleKey)}`)
            : Promise.resolve(null),
        recycleKey
            ? api.get(
                  `recycle/recycling-perperson/?region=${encodeURIComponent(recycleKey)}&year=24`
              )
            : Promise.resolve(null),
        recycleKey ? api.get(`recycle/recycling-good/`) : Promise.resolve(null),
        waterKey ? fetchWaterResults(waterKey) : Promise.resolve(null),
    ]

    const results = await Promise.allSettled(calls)

    const airData =
        results[0].status === "fulfilled" ? (results[0].value as AirResultsData | null) : null

    const recycleOta = extractData<unknown>(results[1])
    const recyclePerPerson = extractData<unknown>(results[2])
    const recycleGeneral = extractData<{ results?: Record<string, unknown> }>(results[3])

    const waterData =
        results[4].status === "fulfilled" ? (results[4].value as WaterTabData | null) : null

    let recycleUsableGeneral: unknown | null = null

    if (recycleGeneral?.results) {
        const allGood = recycleGeneral.results
        const yearKeys = Object.keys(allGood).filter((k) => /^\d+$/.test(k))

        if (yearKeys.length) {
            const latestYearKey = yearKeys
                .map((k) => parseInt(k, 10))
                .sort((a, b) => b - a)[0]
                .toString()

            recycleUsableGeneral = allGood[latestYearKey] ?? null
        }
    }

    return {
        water: waterData,
        recycle: {
            ota: recycleOta,
            perPerson: recyclePerPerson,
            usableGeneral: recycleUsableGeneral,
        },
        air: {
            data: airData,
        },
    }
}
