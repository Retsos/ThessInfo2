"use client"

type Props = {
  open: boolean
  onClose: () => void
}

export default function RecycleInfoModal({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/35 px-4 py-6 backdrop-blur-[2px]">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-emerald-100 px-6 py-5">
          <div>
            <h4 className="text-xl font-semibold text-[#1a535c]">
              Πώς μετριέται η ανακύκλωση;
            </h4>
            <p className="mt-1 text-sm text-[#1a535c]/72">
              Δείκτες Ανακύκλωσης — kg/κάτοικο & Efficiency
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-800 transition hover:bg-emerald-50"
            aria-label="Κλείσιμο"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="max-h-[calc(90vh-88px)] overflow-y-auto px-6 py-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#a7f3d0] hover:[&::-webkit-scrollbar-thumb]:bg-[#059669]">
          <p className="text-sm leading-6 text-[#1a535c]/82 mb-5">
            Η επίδοση της ανακύκλωσης αξιολογείται με δύο βασικούς δείκτες:
          </p>

          <div className="mb-6 rounded-2xl border border-[#d7eff0] bg-[#f8fdfd] p-5">
            <h5 className="text-base font-semibold text-[#1a535c] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-700">1</span>
              Κιλά ανά κάτοικο (kg/κάτ.)
            </h5>
            <p className="mt-2 text-sm leading-6 text-[#1a535c]/82">
              Δείχνει πόσα κιλά ανακυκλώσιμων συλλέγονται ανά άτομο. Όσο μεγαλύτερη η τιμή, τόσο μεγαλύτερη η συμμετοχή των πολιτών.
            </p>
          </div>

          <div className="mb-6 rounded-2xl border border-[#d7eff0] bg-[#f8fdfd] p-5">
            <h5 className="text-base font-semibold text-[#1a535c] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-700">2</span>
              Απόδοση διαλογής (Efficiency %)
            </h5>
            <p className="mt-2 text-sm leading-6 text-[#1a535c]/82">
              Δείχνει την <strong>ποιότητα</strong> της ανακύκλωσης. Υπολογίζεται ως:
            </p>
            <div className="my-3 rounded-xl bg-white border border-emerald-100 px-4 py-3 text-center text-sm font-medium text-emerald-800 shadow-sm">
              Καθαρά Ανακυκλώσιμα / (Καθαρά Ανακυκλώσιμα + Υπόλειμμα)
            </div>
            <p className="mt-3 text-sm leading-6 text-[#1a535c]/82">
              Το <strong>υπόλειμμα</strong> είναι τα κοινά απορρίμματα που καταλήγουν λανθασμένα στον μπλε κάδο και τελικά οδηγούνται σε ταφή.
            </p>

            <ul className="mt-4 space-y-2 text-sm leading-6 text-[#1a535c]/82">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">👉</span>
                <span><strong>Υψηλή απόδοση</strong> σημαίνει σωστή διαλογή στην πηγή.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">👉</span>
                <span><strong>Χαμηλή απόδοση</strong> σημαίνει ότι μεγάλο μέρος του περιεχομένου απορρίπτεται.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm leading-6 text-[#1a535c]/85 flex items-start gap-3">
            <span className="text-lg">🎯</span>
            <p>
              Ο δείκτης υπολογίζεται στο Κέντρο Διαλογής (ΚΔΑΥ), με επιθυμητό στόχο περίπου <strong>70%</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
