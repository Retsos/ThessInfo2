import { getRegionBySlug, regionCatalog } from "../../data/region-catalog"
import RegionResultsPage from "../../components/results/RegionResultsPage"

type Props = {
    params: Promise<{ slug: string }>
}

export default async function ServiceRegionPage({ params }: Props) {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
  const region = getRegionBySlug(decodedSlug)

    if (!region) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16">
                <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-semibold text-red-700">
                        Δεν βρέθηκε region για αυτό το slug
                    </h1>

                    <p className="mt-4 text-sm text-slate-700">
                        Slug από URL: <strong>{slug}</strong>
                    </p>

                    <div className="mt-6">
                        <p className="text-sm font-semibold text-slate-900">
                            Μερικά διαθέσιμα slugs:
                        </p>

                        <ul className="mt-3 space-y-2 text-sm text-slate-700">
                            {regionCatalog.slice(0, 10).map((item) => (
                                <li key={item.slug}>
                                    {item.label} → <code>{item.slug}</code>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

    return <RegionResultsPage region={region} />
}