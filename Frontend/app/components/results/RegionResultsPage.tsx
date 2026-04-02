"use client"

import { useEffect, useMemo, useState } from "react"
import type { RegionCatalogItem } from "../../data/region-catalog"
import {
    fetchRegionResults,
    type RegionResultsData,
} from "@/lib/services/fetch-region-results"
import ResultsHeader from "./header"
import ResultsTabs, { type ResultsTabId } from "./tabs"
import ResultsLoading from "./loading"
import WaterTab from "./water/tab"
import RecycleTab from "./recycle/tab"
import AirTab from "./air/tab"
import RegionSearch from "../services/region-search"

type Props = {
    region: RegionCatalogItem
}

export default function RegionResultsPage({ region }: Props) {
    const availableTabs = useMemo<ResultsTabId[]>(() => {
        const tabs: ResultsTabId[] = []

        if (region.availability.water) tabs.push("water")
        if (region.availability.recycle) tabs.push("recycle")
        if (region.availability.air) tabs.push("air")

        return tabs
    }, [region])

    const [activeTab, setActiveTab] = useState<ResultsTabId>(
        availableTabs[0] ?? "water"
    )
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<RegionResultsData | null>(null)

    useEffect(() => {
        if (!availableTabs.includes(activeTab)) {
            setActiveTab(availableTabs[0] ?? "water")
        }
    }, [availableTabs, activeTab])

    useEffect(() => {
        let cancelled = false

        async function run() {
            try {
                setLoading(true)
                setError(null)

                const result = await fetchRegionResults(region)

                if (!cancelled) {
                    setData(result)
                }
            } catch {
                if (!cancelled) {
                    setError("Αποτυχία φόρτωσης δεδομένων για την περιοχή.")
                    setData(null)
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        run()

        return () => {
            cancelled = true
        }
    }, [region])

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
            <ResultsHeader region={region} />
            <div className="mt-6">
                <RegionSearch compact initialRegionLabel={region.label} />
            </div>
            <ResultsTabs
                region={region}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <div className="mt-8">
                {loading && <ResultsLoading />}

                {!loading && error && (
                    <div className="rounded-[1.5rem] border border-red-200 bg-white p-6 text-red-700 shadow-sm">
                        {error}
                    </div>
                )}

                {!loading && !error && !data && (
                    <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 text-[#1a535c] shadow-sm">
                        Δεν υπάρχουν διαθέσιμα δεδομένα για αυτή την περιοχή.
                    </div>
                )}

                {!loading && !error && data && (
                    <>
                        {activeTab === "water" && (
                            <WaterTab
                                regionLabel={region.label}
                                water={data.water}
                            />
                        )}

                        {activeTab === "recycle" && (
                            <RecycleTab
                                regionLabel={region.label}
                                ota={data.recycle.ota}
                                perPerson={data.recycle.perPerson}
                                usableGeneral={data.recycle.usableGeneral}
                            />
                        )}

                        {activeTab === "air" && (
                            <AirTab
                                regionLabel={region.label}
                                latest={data.air.latest}
                                yearly={data.air.yearly}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
