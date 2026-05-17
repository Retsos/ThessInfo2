"use client"

type Props = {
  open: boolean
  onClose: () => void
}

export default function EqiInfoModal({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/35 px-4 py-6 backdrop-blur-[2px]">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-teal-100 bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-teal-100 px-6 py-5">
          <div>
            <h4 className="text-xl font-semibold text-[#1a535c]">
              Πώς υπολογίζεται το EQI;
            </h4>
            <p className="mt-1 text-sm text-[#1a535c]/72">
              Περιβαλλοντικός Δείκτης Ποιότητας — Environmental Quality Index
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-teal-200 bg-white text-teal-800 transition hover:bg-teal-50"
            aria-label="Κλείσιμο"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="max-h-[calc(90vh-88px)] overflow-y-auto px-6 py-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#cfe9ea] hover:[&::-webkit-scrollbar-thumb]:bg-[#1daaad]">
          {/* Intro */}
          <p className="text-sm leading-6 text-[#1a535c]/82">
            Το <span className="font-semibold">EQI</span> δεν είναι μια αυθαίρετη τιμή, αλλά το αποτέλεσμα
            της σύνθεσης δύο διεθνώς αναγνωρισμένων δεικτών:
          </p>

          {/* AQI Explanation */}
          <div className="mt-4 rounded-xl border border-cyan-100 bg-cyan-50/50 px-4 py-3">
            <h5 className="font-semibold text-cyan-800">🌬️ Δείκτης Ποιότητας Αέρα (AQI)</h5>
            <p className="mt-1.5 text-sm leading-6 text-[#1a535c]/82">
              Παρακολουθούμε τους ρύπους NO₂, SO₂, O₃, CO και NO.
              Το AQI καθορίζεται από τον <span className="font-medium">χειρότερο ρύπο</span> της
              στιγμής. Αν ένας ρύπος ξεπερνά το όριο, ολόκληρος ο δείκτης υποβαθμίζεται αμέσως.
            </p>
            <p className="mt-1 text-sm text-[#1a535c]/68">
              <code>AQI = max(PI_NO₂, PI_SO₂, PI_O₃, PI_CO, PI_NO)</code>
            </p>
          </div>

          {/* WQI Explanation */}
          <div className="mt-3 rounded-xl border border-sky-100 bg-sky-50/50 px-4 py-3">
            <h5 className="font-semibold text-sky-800">💧 Δείκτης Ποιότητας Νερού (WQI)</h5>
            <p className="mt-1.5 text-sm leading-6 text-[#1a535c]/82">
              Αναλύουμε κρίσιμες παραμέτρους (pH, θολότητα, χλωριούχα, αγωγιμότητα κ.α.).
              Κάθε παράμετρος συγκρίνεται με την ιδανική της τιμή και το επιτρεπτό όριο,
              δημιουργώντας έναν <span className="font-medium">σταθμισμένο μέσο όρο</span>.
            </p>
            <p className="mt-1 text-sm text-[#1a535c]/68">
              <code>WQI = Σ(Wᵢ × qᵢ) / Σ(Wᵢ)</code>
            </p>
          </div>

          {/* Mathematical Approach */}
          <h5 className="mt-5 text-base font-semibold text-[#1a535c]">
            Η Μαθηματική Προσέγγιση
          </h5>
          <p className="mt-2 text-sm leading-6 text-[#1a535c]/82">
            Για τη δημιουργία του EQI, οι δύο δείκτες κανονικοποιούνται στην ίδια κλίμακα
            (0–100) μέσω <span className="font-medium">piecewise μετατροπής</span> που ευθυγραμμίζει
            τα ποιοτικά επίπεδα:
          </p>

          <div className="mt-2 overflow-x-auto rounded-xl border border-teal-100">
            <table className="min-w-full text-left text-sm text-[#1a535c]/88">
              <thead className="bg-teal-50/70 text-xs uppercase tracking-wide text-[#1a535c]/72">
                <tr>
                  <th className="px-4 py-2">AQI εύρος</th>
                  <th className="px-4 py-2">WQI εύρος</th>
                  <th className="px-4 py-2">Norm εύρος</th>
                  <th className="px-4 py-2">Ποιοτικό επίπεδο</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-teal-100">
                  <td className="px-4 py-2">0–50</td>
                  <td className="px-4 py-2">0–25</td>
                  <td className="px-4 py-2">0–20</td>
                  <td className="px-4 py-2 font-medium text-emerald-700">Εξαιρετική</td>
                </tr>
                <tr className="border-t border-teal-100">
                  <td className="px-4 py-2">51–100</td>
                  <td className="px-4 py-2">26–50</td>
                  <td className="px-4 py-2">20–40</td>
                  <td className="px-4 py-2 font-medium text-green-700">Καλή</td>
                </tr>
                <tr className="border-t border-teal-100">
                  <td className="px-4 py-2">101–150</td>
                  <td className="px-4 py-2">51–75</td>
                  <td className="px-4 py-2">40–60</td>
                  <td className="px-4 py-2 font-medium text-amber-700">Μέτρια</td>
                </tr>
                <tr className="border-t border-teal-100">
                  <td className="px-4 py-2">151–200</td>
                  <td className="px-4 py-2">76–100</td>
                  <td className="px-4 py-2">60–80</td>
                  <td className="px-4 py-2 font-medium text-orange-700">Κακή</td>
                </tr>
                <tr className="border-t border-teal-100">
                  <td className="px-4 py-2">201–300</td>
                  <td className="px-4 py-2">101–200</td>
                  <td className="px-4 py-2">80–90</td>
                  <td className="px-4 py-2 font-medium text-rose-700">Πολύ Ανθυγιεινή</td>
                </tr>
                <tr className="border-t border-teal-100">
                  <td className="px-4 py-2">301–500</td>
                  <td className="px-4 py-2">&gt;200</td>
                  <td className="px-4 py-2">90–100</td>
                  <td className="px-4 py-2 font-medium text-rose-800">Επικίνδυνη</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-sm leading-6 text-[#1a535c]/82">
            Η ποιότητα του αέρα κατέχει το <span className="font-semibold">70%</span> της
            βαρύτητας, καθώς η έκθεση σε αυτόν είναι συνεχής και άμεση, ενώ η ποιότητα
            του νερού συνεισφέρει κατά <span className="font-semibold">30%</span>.
          </p>

          <div className="mt-2 rounded-xl border border-teal-100 bg-teal-50/50 px-4 py-3 text-sm text-[#1a535c]/85">
            <code>EQI_raw = 0.7 × Air_norm + 0.3 × Water_norm</code>
            <br />
            <code>EQI_display = 100 − EQI_raw</code>
            <p className="mt-2 text-xs text-[#1a535c]/65">
              <span className="font-medium">Κρίσιμη ασφαλιστική δικλείδα:</span> Αν ένας
              παράγοντας φτάσει σε κρίσιμο επίπεδο (norm ≥ 60), το EQI δεν μπορεί να
              «κρυφτεί» πίσω από τον υγιή παράγοντα — το EQI θα είναι τουλάχιστον 85%
              της χειρότερης τιμής.
            </p>
          </div>

          {/* Legend / Classification */}
          <h5 className="mt-5 text-base font-semibold text-[#1a535c]">
            Ερμηνεία Χρωμάτων
          </h5>

          <div className="mt-2 overflow-x-auto rounded-xl border border-teal-100">
            <table className="min-w-full text-left text-sm text-[#1a535c]/88">
              <thead className="bg-teal-50/70 text-xs uppercase tracking-wide text-[#1a535c]/72">
                <tr>
                  <th className="px-4 py-2">EQI Σκορ</th>
                  <th className="px-4 py-2">Κατάσταση</th>
                  <th className="px-4 py-2">Περιγραφή</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-teal-100">
                  <td className="px-4 py-2 font-semibold text-emerald-700">90 – 100</td>
                  <td className="px-4 py-2 font-medium">Εξαιρετική</td>
                  <td className="px-4 py-2">Ιδανικές συνθήκες αέρα και νερού.</td>
                </tr>
                <tr className="border-t border-teal-100">
                  <td className="px-4 py-2 font-semibold text-green-700">75 – 89</td>
                  <td className="px-4 py-2 font-medium">Καλή</td>
                  <td className="px-4 py-2">Το περιβάλλον είναι υγιές, με ελάχιστες αποκλίσεις.</td>
                </tr>
                <tr className="border-t border-teal-100">
                  <td className="px-4 py-2 font-semibold text-amber-700">50 – 74</td>
                  <td className="px-4 py-2 font-medium">Μέτρια</td>
                  <td className="px-4 py-2">Υπάρχει επιβάρυνση σε έναν από τους δύο παράγοντες.</td>
                </tr>
                <tr className="border-t border-teal-100">
                  <td className="px-4 py-2 font-semibold text-rose-700">Κάτω από 50</td>
                  <td className="px-4 py-2 font-medium">Φτωχή</td>
                  <td className="px-4 py-2">Σοβαρή επιβάρυνση. Ο «Κυρίαρχος Παράγοντας» υποδεικνύει το κύριο πρόβλημα.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Disclaimer */}
          <p className="mt-5 rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-xs leading-5 text-[#1a535c]/65">
            ⚠️ Τα δεδομένα βασίζονται στους διαθέσιμους σταθμούς μέτρησης. Η τοπική ποιότητα
            μπορεί να διαφέρει ανάλογα με τις συνθήκες της γειτονιάς σας (π.χ. παλαιότητα
            σωληνώσεων ή κίνηση στους δρόμους).
          </p>
        </div>
      </div>
    </div>
  )
}
