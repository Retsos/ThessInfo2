import Link from "next/link"

import { RegionResults } from "./../../components/services/region-results"
import { getRegionByLabel } from "./../../data/region-catalog"

type Props = {
    searchParams: {
        region?: string
    }
}

export default function ServiceResultsPage({ searchParams }: Props) {
    const selectedLabel = searchParams.region
    const region = selectedLabel ? getRegionByLabel(selectedLabel) : null

    if (!region) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
                <div className="rounded-[1.7rem] border border-[#d7eff0] bg-white p-8 text-center shadow-sm">
                    <h1 className="text-3xl font-semibold tracking-tight text-[#1a535c]">
                        Δεν βρέθηκε περιοχή
                    </h1>

                    <p className="mt-4 text-sm leading-7 text-[#1a535c]/78 md:text-base">
                        Η περιοχή που ζητήθηκε δεν υπάρχει στο catalog ή δεν επιλέχθηκε σωστά.
                    </p>

                    <Link
                        href="/services"
                        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#1daaad] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#179ca0]"
                    >
                        Επιστροφή στις υπηρεσίες
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#f7fdfd_38%,#ffffff_100%)]">
            <RegionResults region={region} />
        </div>
    )
}