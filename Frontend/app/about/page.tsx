import Link from "next/link"
import { ArrowRight, Database, MapPinned, Waves, Wind } from "lucide-react"

const pillars = [
    {
        title: "Τι είναι το ThessInfo",
        description:
            "Το ThessInfo είναι μια πλατφόρμα περιβαλλοντικής πληροφόρησης για τη Θεσσαλονίκη, σχεδιασμένη ώστε τα δεδομένα να γίνονται πιο κατανοητά, πιο ήρεμα στην ανάγνωση και πιο χρήσιμα στην πράξη.",
        icon: Waves,
    },
    {
        title: "Τι προσφέρει",
        description:
            "Συγκεντρώνει πληροφορίες για ποιότητα νερού, ποιότητα αέρα και ανακύκλωση, με στόχο ο χρήστης να μη βλέπει μόνο μετρήσεις αλλά και πλαίσιο για το τι σημαίνουν.",
        icon: Wind,
    },
    {
        title: "Πώς το προσεγγίζουμε",
        description:
            "Δουλεύουμε με θεματικές ενότητες, απλές επεξηγήσεις, δείκτες όπως WQI και AQI, καθώς και μετάβαση σε πιο αναλυτικά αποτελέσματα όταν ο χρήστης θέλει περισσότερη λεπτομέρεια.",
        icon: Database,
    },
]

const values = [
    "Τοπική εστίαση στη Θεσσαλονίκη αντί για ένα γενικό dashboard χωρίς ταυτότητα.",
    "Καθαρή παρουσίαση ώστε τα δεδομένα να διαβάζονται χωρίς τεχνικό θόρυβο.",
    "Θεματική πλοήγηση που βοηθά τον χρήστη να καταλάβει πρώτα το πλαίσιο και μετά τις λεπτομέρειες.",
]

export default function AboutPage() {
    return (
        <div className="overflow-hidden bg-[linear-gradient(180deg,#f7fbfb_0%,#f3f8f8_42%,#ffffff_100%)]">
            <section className="relative overflow-hidden bg-[linear-gradient(135deg,#2e5f62_0%,#4f7f82_48%,#86a9a8_100%)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_26%)]" />

                <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 md:px-6 md:pb-24 md:pt-20">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/95">
                            <Waves className="h-4 w-4" />
                            Σχετικά με την πλατφόρμα
                        </div>

                        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                            Τι είναι το ThessInfo
                        </h1>

                        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/92">
                            Μια προσπάθεια να γίνουν τα περιβαλλοντικά δεδομένα της Θεσσαλονίκης πιο καθαρά, πιο
                            ανθρώπινα και πιο χρήσιμα για όποιον θέλει να καταλάβει τι συμβαίνει στην πόλη.
                        </p>

                        <p className="mt-4 max-w-2xl text-base leading-7 text-white/84">
                            Η λογική του ThessInfo δεν είναι να γεμίσει την οθόνη με αριθμούς. Είναι να οργανώσει την
                            πληροφορία έτσι ώστε να μπορείς πρώτα να καταλάβεις το νόημα και μετά να πας στα πιο
                            αναλυτικά δεδομένα.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
                <div className="grid gap-4 lg:grid-cols-3">
                    {pillars.map((item) => {
                        const Icon = item.icon

                        return (
                            <div
                                key={item.title}
                                className="rounded-[1.8rem] border border-[#d9e8e8] bg-white p-6 shadow-sm"
                            >
                                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef7f7] text-[#2f6d70]">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <h2 className="mt-4 text-xl font-semibold tracking-tight text-[#1a535c]">
                                    {item.title}
                                </h2>
                                <p className="mt-3 text-sm leading-7 text-[#1a535c]/78">
                                    {item.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6 md:pb-16">
                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-[2rem] border border-[#d9e8e8] bg-white p-6 shadow-sm md:p-8">
                        <h2 className="text-2xl font-semibold tracking-tight text-[#1a535c]">
                            Γιατί υπάρχει αυτή η σελίδα
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-[#1a535c]/78">
                            Το `Σχετικά` είναι το σημείο όπου ο χρήστης καταλαβαίνει γρήγορα τι είναι η πλατφόρμα, τι
                            είδους πληροφορίες θα βρει και γιατί η δομή της είναι οργανωμένη γύρω από θεματικές
                            ενότητες όπως νερό, αέρας και ανακύκλωση.
                        </p>
                        <p className="mt-4 text-sm leading-7 text-[#1a535c]/78">
                            Είναι μια πιο ήρεμη εισαγωγή πριν από τις σελίδες αποτελεσμάτων, ώστε να υπάρχει πρώτα
                            κατανόηση του project και μετά πλοήγηση στις λεπτομέρειες.
                        </p>
                    </div>

                    <div className="rounded-[2rem] border border-[#dbe8e9] bg-[linear-gradient(180deg,#fbfdfd_0%,#f3f8f8_100%)] p-6 shadow-sm md:p-8">
                        <h2 className="text-2xl font-semibold tracking-tight text-[#1a535c]">
                            Βασικές αρχές
                        </h2>

                        <div className="mt-5 space-y-3">
                            {values.map((item) => (
                                <div
                                    key={item}
                                    className="rounded-[1.3rem] border border-white/80 bg-white px-4 py-3 text-sm leading-7 text-[#1a535c]/80"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
                <div className="rounded-[2rem] border border-[#d9e8e8] bg-white p-6 shadow-sm md:p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <h2 className="text-2xl font-semibold tracking-tight text-[#1a535c]">
                                Από εδώ μπορείς να συνεχίσεις
                            </h2>
                            <p className="mt-2 text-sm leading-7 text-[#1a535c]/78">
                                Αν θέλεις να δεις στην πράξη πώς οργανώνεται η πληροφορία, η επόμενη σωστή στάση είναι
                                οι υπηρεσίες και οι θεματικές ενότητες της πλατφόρμας.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/services"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#2f6d70] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(47,109,112,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#285d60]"
                            >
                                <MapPinned className="h-4 w-4" />
                                Δες υπηρεσίες
                            </Link>

                            <Link
                                href="/learn-more"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#d6e6e6] bg-white px-6 text-sm font-semibold text-[#1a535c] transition-colors hover:bg-[#f7fbfb]"
                            >
                                Μάθε περισσότερα
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
