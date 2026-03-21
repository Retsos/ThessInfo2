"use client"

import { useMemo, useState } from "react"
import type { RegionCatalogItem } from "../../data/region-catalog"
import ResultsHeader from "./header"
import ResultsTabs, { type ResultsTabId } from "./tabs"

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

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
            <ResultsHeader region={region} />
            <ResultsTabs
                region={region}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <div className="mt-8 rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
                {activeTab === "water" && <div>Water tab placeholder</div>}
                {activeTab === "recycle" && <div>Recycle tab placeholder</div>}
                {activeTab === "air" && <div>Air tab placeholder</div>}
            </div>
        </div>
    )
}