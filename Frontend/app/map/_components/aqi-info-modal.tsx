"use client"

type Props = {
  open: boolean
  onClose: () => void
}

export default function AqiInfoModal({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/35 px-4 py-6 backdrop-blur-[2px]">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-cyan-100 bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-cyan-100 px-6 py-5">
          <div>
            <h4 className="text-xl font-semibold text-[#1a535c]">
              Πώς υπολογίζεται το AQI;
            </h4>
            <p className="mt-1 text-sm text-[#1a535c]/72">
              Δείκτης Ποιότητας Αέρα — Air Quality Index
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-cyan-200 bg-white text-cyan-800 transition hover:bg-cyan-50"
            aria-label="Κλείσιμο"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="max-h-[calc(90vh-88px)] overflow-y-auto px-6 py-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#cceef2] hover:[&::-webkit-scrollbar-thumb]:bg-[#2992a2]">
          <p className="text-sm leading-6 text-[#1a535c]/82">
            Ο υπολογισμός ξεκινά ξεχωριστά για κάθε ρύπο. Παίρνουμε τη μετρημένη
            συγκέντρωση του ρύπου, τη φέρνουμε στις ίδιες μονάδες με το αντίστοιχο όριο
            και μετά βρίσκουμε τον επιμέρους δείκτη του:
          </p>
          <p className="mt-1 text-sm text-[#1a535c]/68">
            <code>PI = (μετρημένη συγκέντρωση / όριο) × 100</code>
          </p>

          <p className="mt-3 text-sm leading-6 text-[#1a535c]/82">
            Το <span className="font-medium">PI</span> δείχνει πόσο κοντά ή πόσο πάνω από
            το όριο βρίσκεται κάθε ρύπος. Τιμή <span className="font-medium">100</span>{" "}
            σημαίνει ότι ο ρύπος είναι ακριβώς στο όριο, τιμές κάτω από 100 είναι κάτω
            από το όριο και τιμές πάνω από 100 το ξεπερνούν.
          </p>

          <p className="mt-3 text-sm leading-6 text-[#1a535c]/82">
            Στη συνέχεια το τελικό <span className="font-medium">AQI</span> δεν είναι
            μέσος όρος — παίρνουμε τον <span className="font-semibold">χειρότερο</span> από
            όλους τους επιμέρους δείκτες:
          </p>
          <p className="mt-1 text-sm text-[#1a535c]/68">
            <code>AQI = max(PI_NO₂, PI_SO₂, PI_O₃, PI_CO, PI_NO)</code>
          </p>

          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-[#1a535c]/82">
            <li>
              Αν ένας μόνο ρύπος είναι πολύ πάνω από το όριο, αυτός καθορίζει το AQI.
            </li>
            <li>
              Στο <span className="font-medium">CO</span> γίνεται μετατροπή σε{" "}
              <code>mg/m³</code> πριν από τη σύγκριση, ώστε να ταιριάζει με το όριο.
            </li>
            <li>
              Έτσι ο δείκτης δείχνει άμεσα ποιος ρύπος είναι ο πιο επιβαρυντικός.
            </li>
          </ul>

          {/* Pollutants table */}
          <div className="mt-4 overflow-x-auto rounded-xl border border-cyan-100">
            <table className="min-w-full text-left text-sm text-[#1a535c]/88">
              <thead className="bg-cyan-50/70 text-xs uppercase tracking-wide text-[#1a535c]/72">
                <tr>
                  <th className="px-4 py-2">Ρύπος</th>
                  <th className="px-4 py-2">Μονάδα</th>
                  <th className="px-4 py-2">Ωριαίο όριο</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-cyan-100">
                  <td className="px-4 py-2 font-medium">NO₂</td>
                  <td className="px-4 py-2">μg/m³</td>
                  <td className="px-4 py-2">200</td>
                </tr>
                <tr className="border-t border-cyan-100">
                  <td className="px-4 py-2 font-medium">SO₂</td>
                  <td className="px-4 py-2">μg/m³</td>
                  <td className="px-4 py-2">350</td>
                </tr>
                <tr className="border-t border-cyan-100">
                  <td className="px-4 py-2 font-medium">O₃</td>
                  <td className="px-4 py-2">μg/m³</td>
                  <td className="px-4 py-2">180</td>
                </tr>
                <tr className="border-t border-cyan-100">
                  <td className="px-4 py-2 font-medium">CO</td>
                  <td className="px-4 py-2">mg/m³</td>
                  <td className="px-4 py-2">10</td>
                </tr>
                <tr className="border-t border-cyan-100">
                  <td className="px-4 py-2 font-medium">NO</td>
                  <td className="px-4 py-2">μg/m³</td>
                  <td className="px-4 py-2">400</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Classification */}
          <h5 className="mt-5 text-base font-semibold text-[#1a535c]">
            Κλίμακα AQI
          </h5>
          <div className="mt-2 rounded-xl border border-cyan-100 bg-cyan-50/60 px-4 py-3 text-sm leading-6 text-[#1a535c]/85">
            <div><span className="font-semibold text-emerald-700">0 – 50:</span> Καλή ποιότητα (Good)</div>
            <div><span className="font-semibold text-green-700">51 – 100:</span> Μέτρια (Moderate)</div>
            <div><span className="font-semibold text-amber-700">101 – 150:</span> Ανθυγιεινή για ευαίσθητες ομάδες</div>
            <div><span className="font-semibold text-orange-700">151 – 200:</span> Ανθυγιεινή (Unhealthy)</div>
            <div><span className="font-semibold text-rose-700">201 – 300:</span> Πολύ ανθυγιεινή</div>
            <div><span className="font-semibold text-red-900">301 – 500:</span> Επικίνδυνη (Hazardous)</div>
          </div>

          {/* Disclaimer */}
          <p className="mt-5 rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-xs leading-5 text-[#1a535c]/65">
            ⚠️ Τα δεδομένα βασίζονται στους διαθέσιμους σταθμούς μέτρησης. Η τοπική ποιότητα
            μπορεί να διαφέρει ανάλογα με την κίνηση στους δρόμους και τις τοπικές πηγές ρύπανσης.
          </p>
        </div>
      </div>
    </div>
  )
}
