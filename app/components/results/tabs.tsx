import { Droplets, Recycle, Wind } from "lucide-react"
import type { RegionCatalogItem } from "../../data/region-catalog"

export type ResultsTabId = "water" | "recycle" | "air"

type Props = {
    region: RegionCatalogItem
    activeTab: ResultsTabId
    onTabChange: (tab: ResultsTabId) => void
}

const tabMeta = {
    water: {
        label: "Ποιότητα Νερού",
        icon: Droplets,
        activeClass: "border-sky-200 bg-sky-50/80 text-sky-700",
    },
    recycle: {
        label: "Ανακύκλωση",
        icon: Recycle,
        activeClass: "border-emerald-200 bg-emerald-50/80 text-emerald-700",
    },
    air: {
        label: "Ποιότητα Αέρα",
        icon: Wind,
        activeClass: "border-cyan-200 bg-cyan-50/80 text-cyan-700",
    },
} satisfies Record<
    ResultsTabId,
    {
        label: string
        icon: React.ComponentType<{ className?: string }>
        activeClass: string
    }
>

export default function ResultsTabs({
    region,
    activeTab,
    onTabChange,
}: Props) {
    const tabs: ResultsTabId[] = []

    if (region.availability.water) tabs.push("water")
    if (region.availability.recycle) tabs.push("recycle")
    if (region.availability.air) tabs.push("air")

    return (
        <div className="mt-6 flex flex-wrap gap-3">
            {tabs.map((tab) => {
                const meta = tabMeta[tab]
                const Icon = meta.icon
                const isActive = activeTab === tab

                return (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => onTabChange(tab)}
                        className={[
                            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                            isActive
                                ? meta.activeClass
                                : "border-[#d7eff0] bg-white text-[#1a535c]/75 hover:bg-[#f7fcfc]",
                        ].join(" ")}
                    >
                        <Icon className="h-4 w-4" />
                        {meta.label}
                    </button>
                )
            })}
        </div>
    )
}