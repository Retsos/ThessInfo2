import { bestRegionMocks } from "./services-data"

export default function ServicesBestMocks() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1daaad]">
                        Mock προβολές
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1a535c] md:text-4xl">
                        Περιοχές με κορυφαία στατιστικά
                    </h2>
                    <p className="mt-4 text-base leading-7 text-[#1a535c]/80">
                        Εδώ θα κουμπώσουν αργότερα τα πραγματικά best-of αποτελέσματα. Προς το
                        παρόν κρατάμε το section σαν τίμιο placeholder και δεν παριστάνουμε ότι
                        έχουμε data έτοιμα από τον ουρανό.
                    </p>
                </div>

                <span className="inline-flex w-fit rounded-full bg-[#eefafa] px-3 py-1.5 text-xs font-semibold text-[#006264]">
                    Mock section
                </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
                {bestRegionMocks.map((card) => {
                    const Icon = card.icon

                    return (
                        <div
                            key={card.title}
                            className="overflow-hidden rounded-[1.4rem] border border-[#d7eff0] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(29,170,173,0.12)]"
                        >
                            <div className={`h-1.5 w-full bg-gradient-to-r ${card.accentClass}`} />

                            <div className="p-6">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff6d8] text-[#b98a00]">
                                    <Icon className="h-5 w-5" />
                                </div>

                                <h3 className="text-xl font-semibold text-[#1a535c]">
                                    {card.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-[#1a535c]/78">
                                    {card.description}
                                </p>

                                <p className={`mt-5 text-sm font-semibold ${card.textClass}`}>
                                    Θα ενεργοποιηθεί όταν δέσουμε τα κανονικά δεδομένα.
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}