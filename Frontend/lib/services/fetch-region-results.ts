import type { RegionCatalogItem } from "../../app/data/region-catalog"
import type { AirResultsData } from "../../app/components/results/air/air-types"
import type { WaterTabData } from "../../app/components/results/water/water-types"
import type { RecycleResultsData } from "../../app/components/results/recycle/recycle-types"
import { fetchWaterResults } from "./fetch-water-results"
import { fetchAirResults } from "./fetch-air-results"
import { fetchRecycleResults } from "./fetch-recycle-results"

export type RegionResultsData = {
    water: WaterTabData | null
    recycle: RecycleResultsData | null
    air: {
        data: AirResultsData | null
    }
}

export async function fetchRegionResults(
    region: RegionCatalogItem
): Promise<RegionResultsData> {
    const waterKey = region.keys.water
    const recycleKey = region.keys.recycle
    const airKey = region.keys.air

    const [airResult, recycleResult, waterResult] = await Promise.allSettled([
        airKey ? fetchAirResults(airKey) : Promise.resolve(null),
        recycleKey ? fetchRecycleResults(recycleKey) : Promise.resolve(null),
        waterKey ? fetchWaterResults(waterKey) : Promise.resolve(null),
    ])

    const airData =
        airResult.status === "fulfilled"
            ? (airResult.value as AirResultsData | null)
            : null

    const recycleData =
        recycleResult.status === "fulfilled"
            ? (recycleResult.value as RecycleResultsData | null)
            : null

    const waterData =
        waterResult.status === "fulfilled"
            ? (waterResult.value as WaterTabData | null)
            : null

    return {
        water: waterData,
        recycle: recycleData,
        air: {
            data: airData,
        },
    }
}
