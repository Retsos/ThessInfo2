export default function ServicesHero() {
    return (
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#2c999b_0%,#1daaad_45%,#006264_100%)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(186,230,253,0.16),transparent_28%)]" />

            <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 md:px-6 md:pb-28 md:pt-24">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                        Υπηρεσίες και δεδομένα περιοχών
                    </div>

                    <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                        Αναζήτησε πληροφορίες για την περιοχή σου
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
                        Επίλεξε δήμο ή περιοχή και δες διαθέσιμα δεδομένα για ποιότητα νερού,
                        ανακύκλωση και αέρα μέσα από ένα πιο καθαρό και σωστά οργανωμένο flow.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <span className="rounded-full border border-white/15 bg-white/12 px-3 py-1.5 text-sm text-white/95 backdrop-blur-sm">
                            Δήμοι & περιοχές
                        </span>
                        <span className="rounded-full border border-white/15 bg-white/12 px-3 py-1.5 text-sm text-white/95 backdrop-blur-sm">
                            Θεματικά δεδομένα
                        </span>
                        <span className="rounded-full border border-white/15 bg-white/12 px-3 py-1.5 text-sm text-white/95 backdrop-blur-sm">
                            Βάση για αποτελέσματα & charts
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}