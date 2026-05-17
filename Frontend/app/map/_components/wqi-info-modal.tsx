"use client"

type Props = {
  open: boolean
  onClose: () => void
}

export default function WqiInfoModal({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/35 px-4 py-6 backdrop-blur-[2px]">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-sky-100 bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-sky-100 px-6 py-5">
          <div>
            <h4 className="text-xl font-semibold text-[#1a535c]">
              Πώς υπολογίζεται το WQI;
            </h4>
            <p className="mt-1 text-sm text-[#1a535c]/72">
              Δείκτης Ποιότητας Νερού — Water Quality Index
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-sky-200 bg-white text-sky-800 transition hover:bg-sky-50"
            aria-label="Κλείσιμο"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="max-h-[calc(90vh-88px)] overflow-y-auto px-6 py-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#cfe9ea] hover:[&::-webkit-scrollbar-thumb]:bg-[#1daaad]">
          <p className="text-sm leading-6 text-[#1a535c]/82">
            Ο δείκτης ποιότητας νερού (<span className="font-semibold">WQI</span>) υπολογίζεται
            για κάθε παράμετρο μέσω του επιμέρους δείκτη ποιότητας:
          </p>
          <p className="mt-1 text-sm text-[#1a535c]/68">
            <code>qᵢ = 100 × ((τιμή − ιδανική) / (Sᵢ − ιδανική))</code>
          </p>

          <p className="mt-3 text-sm leading-6 text-[#1a535c]/82">
            Στη συνέχεια, ο συνολικός δείκτης προκύπτει ως σταθμισμένος μέσος όρος:
          </p>
          <p className="mt-1 text-sm text-[#1a535c]/68">
            <code>WQI = Σ(Wᵢ × qᵢ) / Σ(Wᵢ)</code>
          </p>

          <p className="mt-3 text-sm leading-6 text-[#1a535c]/82">
            Κάθε παράμετρος περιγράφεται από:
          </p>

          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[#1a535c]/82">
            <li>
              <span className="font-medium">Τιμή αναφοράς (Sᵢ)</span>, που εκφράζει το επιτρεπτό
              όριο,
            </li>
            <li>
              <span className="font-medium">Ιδανική τιμή</span>, που αντιστοιχεί στην άριστη
              ποιότητα,
            </li>
            <li>
              <span className="font-medium">Βάρος σημαντικότητας (Wᵢ)</span>, που καθορίζει τη
              συμβολή της παραμέτρου στον συνολικό δείκτη.
            </li>
          </ul>

          {/* Parameters table */}
          <div className="mt-4 overflow-x-auto rounded-xl border border-sky-100">
            <table className="min-w-full text-left text-sm text-[#1a535c]/88">
              <thead className="bg-sky-50/70 text-xs uppercase tracking-wide text-[#1a535c]/72">
                <tr>
                  <th className="px-4 py-2">Παράμετρος</th>
                  <th className="px-4 py-2">Τιμή αναφοράς (Sᵢ)</th>
                  <th className="px-4 py-2">Ιδανική τιμή</th>
                  <th className="px-4 py-2">Βάρος (Wᵢ)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-sky-100">
                  <td className="px-4 py-2 font-medium">pH</td>
                  <td className="px-4 py-2">8.5</td>
                  <td className="px-4 py-2">7.0</td>
                  <td className="px-4 py-2">0.22</td>
                </tr>
                <tr className="border-t border-sky-100">
                  <td className="px-4 py-2 font-medium">Υπολειμματικό χλώριο (mg/L)</td>
                  <td className="px-4 py-2">0.5</td>
                  <td className="px-4 py-2">0.0</td>
                  <td className="px-4 py-2">0.20</td>
                </tr>
                <tr className="border-t border-sky-100">
                  <td className="px-4 py-2 font-medium">Θολότητα (NTU)</td>
                  <td className="px-4 py-2">1.0</td>
                  <td className="px-4 py-2">0.0</td>
                  <td className="px-4 py-2">0.15</td>
                </tr>
                <tr className="border-t border-sky-100">
                  <td className="px-4 py-2 font-medium">Αργίλιο (μg/L)</td>
                  <td className="px-4 py-2">200.0</td>
                  <td className="px-4 py-2">0.0</td>
                  <td className="px-4 py-2">0.12</td>
                </tr>
                <tr className="border-t border-sky-100">
                  <td className="px-4 py-2 font-medium">Χλωριούχα (mg/L)</td>
                  <td className="px-4 py-2">250.0</td>
                  <td className="px-4 py-2">0.0</td>
                  <td className="px-4 py-2">0.10</td>
                </tr>
                <tr className="border-t border-sky-100">
                  <td className="px-4 py-2 font-medium">Αγωγιμότητα (μS/cm)</td>
                  <td className="px-4 py-2">2500.0</td>
                  <td className="px-4 py-2">0.0</td>
                  <td className="px-4 py-2">0.08</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-sm leading-6 text-[#1a535c]/82">
            Σε περιπτώσεις όπου δεν υπάρχουν διαθέσιμες μετρήσεις για κάποια παράμετρο,
            αυτή δεν συμμετέχει στον υπολογισμό — τόσο ο αριθμητής όσο και ο
            παρονομαστής στον σταθμισμένο μέσο όρο προσαρμόζονται ανάλογα.
          </p>

          {/* Classification */}
          <h5 className="mt-5 text-base font-semibold text-[#1a535c]">
            Κλίμακα WQI
          </h5>
          <div className="mt-2 rounded-xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm leading-6 text-[#1a535c]/85">
            <div><span className="font-semibold text-emerald-700">0 – 25:</span> Εξαιρετική ποιότητα</div>
            <div><span className="font-semibold text-green-700">26 – 50:</span> Καλή ποιότητα</div>
            <div><span className="font-semibold text-amber-700">51 – 75:</span> Μέτρια ποιότητα</div>
            <div><span className="font-semibold text-orange-700">76 – 100:</span> Κακή ποιότητα</div>
            <div><span className="font-semibold text-rose-700">&gt; 100:</span> Ακατάλληλο νερό</div>
          </div>

          {/* Disclaimer */}
          <p className="mt-5 rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-xs leading-5 text-[#1a535c]/65">
            ⚠️ Τα δεδομένα βασίζονται στους διαθέσιμους σταθμούς μέτρησης. Η τοπική ποιότητα
            μπορεί να διαφέρει ανάλογα με τις συνθήκες της γειτονιάς σας (π.χ. παλαιότητα σωληνώσεων).
          </p>
        </div>
      </div>
    </div>
  )
}
