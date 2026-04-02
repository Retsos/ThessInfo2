import { learnMoreCapabilities, learnMoreCards } from "./learn-more-data"

export function LearnMoreHighlights() {
    return (
        <section className="relative z-20 mx-auto -mt-10 max-w-7xl px-4 pb-14 md:-mt-14 md:px-6 md:pb-20">
            <div className="grid gap-6 lg:grid-cols-2">
                {learnMoreCards.map((card, index) => {
                    const Icon = card.icon
                    const accent =
                        index === 0
                            ? "from-[#2c999b] via-[#1daaad] to-[#006264]"
                            : "from-sky-500 via-cyan-500 to-teal-500"

                    return (
                        <div
                            key={card.title}
                            className="overflow-hidden rounded-[1.5rem] border border-[#d6ecec] bg-white shadow-[0_18px_50px_rgba(29,170,173,0.12)]"
                        >
                            <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} />

                            <div className="p-6 md:p-7">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8fbfb] text-[#1daaad]">
                                    <Icon className="h-5 w-5" />
                                </div>

                                <h2 className="text-2xl font-semibold tracking-tight text-[#1a535c]">
                                    {card.title}
                                </h2>

                                <ul className="mt-5 space-y-3">
                                    {card.items.map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-start gap-3 text-sm leading-7 text-[#1a535c]/80"
                                        >
                                            <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#1daaad]" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="mt-10">
                <div className="max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1daaad]">
                        Τι προσφέρει η πλατφόρμα
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1a535c] md:text-4xl">
                        Η πληροφορία οργανώνεται για να διαβάζεται σωστά
                    </h2>
                    <p className="mt-4 text-base leading-7 text-[#1a535c]/80">
                        Το ThessInfo δεν είναι απλώς μια σελίδα με μετρήσεις. Είναι τρόπος
                        να βλέπεις τοπικά δεδομένα με δομή, σαφήνεια και καλύτερη κατανόηση.
                    </p>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {learnMoreCapabilities.map((item, index) => {
                        const Icon = item.icon
                        const bubbleClasses = [
                            "bg-[#e8fbfb] text-[#1daaad]",
                            "bg-[#eaf8ff] text-sky-700",
                            "bg-[#eefcf8] text-teal-700",
                        ]

                        return (
                            <div
                                key={item.title}
                                className="rounded-[1.35rem] border border-[#d7eff0] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(241,250,250,0.9))] p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(29,170,173,0.12)]"
                            >
                                <div
                                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${bubbleClasses[index % bubbleClasses.length]}`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>

                                <h3 className="text-lg font-semibold text-[#1a535c]">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-[#1a535c]/78">
                                    {item.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}