import ServicesHero from "./../components/services/ServicesHero"
import RegionSearch from "./../components/services/region-search"
import ServicesOverview from "./../components/services/ServicesOverview"
import ServicesSteps from "./../components/services/ServicesSteps"

export default function ServicesPage() {
    return (
        <div className="overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#f7fdfd_38%,#ffffff_100%)]">
            <ServicesHero />

            <section className="relative z-20 mx-auto -mt-10 max-w-7xl px-4 md:-mt-14 md:px-6">
                <RegionSearch />

                <div className="mt-4 rounded-2xl border border-[#d7eff0] bg-white/85 px-4 py-3 text-sm text-[#1a535c]/80 shadow-sm">
                    Γρήγορη είσοδος στα δεδομένα της περιοχής σου.
                </div>
            </section>

            <ServicesOverview />
            <ServicesSteps />
        </div>
    )
}