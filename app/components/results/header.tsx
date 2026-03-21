import { Droplets, Recycle, Wind } from "lucide-react"
import type { RegionCatalogItem } from "../../data/region-catalog"

type Props = {
    region: RegionCatalogItem
}

export default function ResultsHeader({ region }: Props) {
    return (
        <div className="rounded-[1.7rem] border border-[#d7eff0] bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1daaad]">
                Αποτελέσματα περιοχής
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#1a535c] md:text-4xl">
                {region.label}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#1a535c]/78 md:text-base">
                Εδώ θα προβάλλονται τα δεδομένα για την επιλεγμένη περιοχή, οργανωμένα
                ανά θεματική ενότητα.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
                {region.availability.water && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1.5 text-sm font-semibold text-sky-700">
                        <Droplets className="h-4 w-4" />
                        Νερό
                    </span>
                )}

                {region.availability.recycle && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                        <Recycle className="h-4 w-4" />
                        Ανακύκλωση
                    </span>
                )}

                {region.availability.air && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1.5 text-sm font-semibold text-cyan-700">
                        <Wind className="h-4 w-4" />
                        Αέρας
                    </span>
                )}
            </div>
        </div>
    )
}