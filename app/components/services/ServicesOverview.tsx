import { serviceCards } from "./services-data"

export default function ServicesOverview() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
            <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1daaad]">
                    Υπηρεσίες Περιβάλλοντος
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1a535c] md:text-4xl">
                    Οι βασικές κατηγορίες δεδομένων της πλατφόρμας
                </h2>
                <p className="mt-4 text-base leading-7 text-[#1a535c]/80">
                    Το section αυτό εξηγεί καθαρά τι θα βρει ο χρήστης. Όχι άλλα τρία άσχετα
                    κουτιά στη σειρά και μετά προσευχές να μοιάζει με προϊόν.
                </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
                {serviceCards.map((card) => {
                    const Icon = card.icon

                    return (
                        <div
                            key={card.title}
                            className={`overflow-hidden rounded-[1.4rem] border bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(29,170,173,0.12)] ${card.borderClass}`}
                        >
                            <div className={`h-1.5 w-full bg-gradient-to-r ${card.gradientClass}`} />

                            <div className="p-6">
                                <div
                                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${card.bubbleClass}`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>

                                <h3 className="text-xl font-semibold text-[#1a535c]">
                                    {card.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-[#1a535c]/78">
                                    {card.description}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}