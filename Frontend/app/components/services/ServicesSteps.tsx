import { steps } from "./services-data"

export default function ServicesSteps() {
    return (
        <section className="bg-[linear-gradient(180deg,rgba(241,250,250,0.96),rgba(255,255,255,0.96),rgba(235,248,255,0.82))]">
            <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
                <div className="max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1daaad]">
                        Πώς λειτουργεί
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1a535c] md:text-4xl">
                        Απλό flow, καθαρό αποτέλεσμα
                    </h2>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-3">
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        const bubbleClasses = [
                            "bg-[#e8fbfb] text-[#1daaad]",
                            "bg-[#eaf8ff] text-sky-700",
                            "bg-[#eefcf8] text-teal-700",
                        ]

                        return (
                            <div
                                key={step.title}
                                className="rounded-[1.35rem] border border-[#d7eff0] bg-white/90 p-6 shadow-sm"
                            >
                                <div
                                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${bubbleClasses[index % bubbleClasses.length]}`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>

                                <h3 className="text-lg font-semibold text-[#1a535c]">
                                    {step.title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-[#1a535c]/78">
                                    {step.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}