import Image from "next/image"
import secImage from "@/assets/sec.png"

export function LearnMoreHero() {
    return (
        <section className="relative isolate overflow-hidden">
            <div className="absolute inset-0 -z-20">
                <Image
                    src={secImage}
                    alt="Περιβαλλοντική πληροφόρηση"
                    fill
                    priority
                    className="object-cover"
                />
            </div>

            <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,98,100,0.76),rgba(29,170,173,0.70),rgba(26,83,92,0.86))]" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(191,245,255,0.15),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.10),transparent_28%)]" />

            <div className="mx-auto flex min-h-[62svh] max-w-7xl items-center justify-center px-4 py-16 text-center md:px-6 md:py-24">
                <div className="max-w-3xl">
                    <div className="inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                        Σχετικά με την πλατφόρμα
                    </div>

                    <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white drop-shadow-sm md:text-5xl lg:text-6xl">
                        Μάθε περισσότερα για το ThessInfo
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
                        Ανακάλυψε πώς οργανώνεται η περιβαλλοντική πληροφορία, ποια είναι η
                        λογική της πλατφόρμας και γιατί η σωστή παρουσίαση των δεδομένων έχει
                        τόση σημασία όσο και τα ίδια τα δεδομένα.
                    </p>
                </div>
            </div>
        </section>
    )
}