import { notFound } from "next/navigation"
import { getRegionBySlug } from "../../data/region-catalog"
import RegionResultsPage from "../../components/results/RegionResultsPage"

type Props = {
    params: Promise<{ slug: string }>
}

export default async function ServiceRegionPage({ params }: Props) {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
    const region = getRegionBySlug(decodedSlug)

    if (!region) {
        notFound()
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(180deg,#f8fafc_0%,#f7fdfd_38%,#ffffff_100%)]">
            <RegionResultsPage region={region} />
        </div>
    )
}
