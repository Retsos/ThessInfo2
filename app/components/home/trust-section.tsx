import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { trustItems } from "./home-data"

export function TrustSection() {
  return (
    <section className="bg-[linear-gradient(180deg,rgba(241,250,250,0.95),rgba(255,255,255,0.96),rgba(235,248,255,0.82))]">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1daaad]">
            Τι μας ξεχωρίζει
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1a535c] md:text-4xl">
            Περιβαλλοντική πληροφορία που διαβάζεται εύκολα και στέκεται σοβαρά
          </h2>

          <p className="mt-4 text-base leading-7 text-[#1a535c]/80">
            Κρατάμε την καθαρότητα του νέου στησίματος, αλλά φέρνουμε πίσω τη
            ζωντάνια και τα χρώματα που ταίριαζαν καλύτερα στο project σου.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {trustItems.map((item, index) => {
            const Icon = item.icon

            const accentClasses = [
              "bg-[#e8fbfb] text-[#1daaad]",
              "bg-[#eaf8ff] text-sky-700",
              "bg-[#eefcf8] text-teal-700",
            ]

            return (
              <Card
                key={item.title}
                className="rounded-[1.35rem] border border-[#d7eff0] bg-white/85 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(29,170,173,0.14)]"
              >
                <CardHeader>
                  <div
                    className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${accentClasses[index % accentClasses.length]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <CardTitle className="text-lg text-[#1a535c]">
                    {item.title}
                  </CardTitle>

                  <CardDescription className="text-sm leading-6 text-[#1a535c]/78">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}