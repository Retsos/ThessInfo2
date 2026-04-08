"use client"

import type { AirPollutantIndices } from "./air-types"

type Props = {
    open: boolean
    onClose: () => void
    selectedMonthLabel: string
    selectedMonthKey: string
    monthAqiScore: number | null
    monthAqiLabel: string
    monthPollutantIndices?: AirPollutantIndices
    monthDominantPollutant?: string | null
    yearAqiScore: number | null
    yearAqiLabel: string | null
    yearDominantPollutant?: string | null
}

const POLLUTANT_LABELS: Record<string, string> = {
    no2_conc: "NO2",
    so2_conc: "SO2",
    o3_conc: "O3",
    co_conc: "CO",
    no_conc: "NO",
}

export default function AirAqiInfoModal({
    open,
    onClose,
    selectedMonthLabel,
    selectedMonthKey,
    monthAqiScore,
    monthAqiLabel,
    monthPollutantIndices,
    monthDominantPollutant,
    yearAqiScore,
    yearAqiLabel,
    yearDominantPollutant,
}: Props) {
    if (!open) return null

    const rows = Object.entries(monthPollutantIndices ?? {})
        .map(([key, value]) => ({
            key,
            label: POLLUTANT_LABELS[key] ?? key,
            value,
        }))
        .filter((row) => row.value != null)
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/35 px-4 py-6 backdrop-blur-[2px]">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-cyan-100 bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-cyan-100 px-6 py-5">
                    <div>
                        <h4 className="text-xl font-semibold text-[#1a535c]">Υπολογισμός AQI αέρα</h4>
                        <p className="mt-1 text-sm text-[#1a535c]/72">
                            Επεξήγηση του δείκτη AQI με βάση τον χειρότερο ρύπο της περιόδου.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-cyan-200 bg-white text-cyan-800 transition hover:bg-cyan-50"
                        aria-label="Κλείσιμο"
                    >
                        x
                    </button>
                </div>

                <div className="max-h-[calc(90vh-88px)] overflow-y-auto px-6 py-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#cceef2] hover:[&::-webkit-scrollbar-thumb]:bg-[#2992a2]">
                    <p className="text-sm leading-6 text-[#1a535c]/82">
                        Ο υπολογισμός ξεκινά ξεχωριστά για κάθε ρύπο. Παίρνουμε τη μετρημένη
                        συγκέντρωση του ρύπου, τη φέρνουμε στις ίδιες μονάδες με το αντίστοιχο όριο
                        και μετά βρίσκουμε τον επιμέρους δείκτη του:
                        {" "}
                        <code>PI = (measured concentration / limit) * 100</code>
                    </p>

                    <p className="mt-3 text-sm leading-6 text-[#1a535c]/82">
                        Το <span className="font-medium">PI</span> δείχνει πόσο κοντά ή πόσο πάνω από
                        το όριο βρίσκεται κάθε ρύπος. Τιμή <span className="font-medium">100</span>
                        σημαίνει ότι ο ρύπος είναι ακριβώς στο όριο, τιμές κάτω από 100 είναι κάτω
                        από το όριο και τιμές πάνω από 100 το ξεπερνούν.
                    </p>

                    <p className="mt-3 text-sm leading-6 text-[#1a535c]/82">
                        Στη συνέχεια το τελικό <span className="font-medium">AQI</span> δεν είναι
                        μέσος όρος. Παίρνουμε τον χειρότερο από όλους τους επιμέρους δείκτες:
                        {" "}
                        <code>AQI = max(PI NO2, PI SO2, PI O3, PI CO, PI NO)</code>
                    </p>

                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-[#1a535c]/82">
                        <li>
                            Αν ένας μόνο ρύπος είναι πολύ πάνω από το όριο, αυτός καθορίζει το AQI.
                        </li>
                        <li>
                            Στο <span className="font-medium">CO</span> γίνεται μετατροπή σε
                            <code>mg/m3</code> πριν από τη σύγκριση, ώστε να ταιριάζει με το όριο.
                        </li>
                        <li>
                            Έτσι ο δείκτης δείχνει άμεσα ποιος ρύπος είναι ο πιο επιβαρυντικός.
                        </li>
                    </ul>

                    <div className="mt-4 rounded-xl border border-cyan-100 bg-cyan-50/60 px-4 py-3 text-sm leading-6 text-[#1a535c]/85">
                        <div><span className="font-semibold">0 - 50:</span> Good</div>
                        <div><span className="font-semibold">51 - 100:</span> Moderate</div>
                        <div><span className="font-semibold">101 - 150:</span> Unhealthy for Sensitive Groups</div>
                        <div><span className="font-semibold">151 - 200:</span> Unhealthy</div>
                        <div><span className="font-semibold">201 - 300:</span> Very Unhealthy</div>
                        <div><span className="font-semibold">301 - 500:</span> Hazardous</div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
                        <h5 className="text-base font-semibold text-[#1a535c]">
                            Επιλεγμένος μήνας: {selectedMonthLabel}
                        </h5>
                        <p className="mt-2 text-sm leading-6 text-[#1a535c]/82">
                            Month key: <code>{selectedMonthKey}</code>
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[#1a535c]/82">
                            Μηνιαίο AQI:{" "}
                            <span className="font-semibold">
                                {monthAqiScore != null
                                    ? `${monthAqiScore.toFixed(2)} (${monthAqiLabel})`
                                    : "Χωρίς διαθέσιμη τιμή"}
                            </span>
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[#1a535c]/82">
                            Κυρίαρχος ρύπος μήνα:{" "}
                            <span className="font-semibold">
                                {monthDominantPollutant
                                    ? POLLUTANT_LABELS[monthDominantPollutant] ?? monthDominantPollutant
                                    : "Χωρίς διαθέσιμη τιμή"}
                            </span>
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[#1a535c]/82">
                            Ετήσιο AQI:{" "}
                            <span className="font-semibold">
                                {yearAqiScore != null && yearAqiLabel
                                    ? `${yearAqiScore.toFixed(2)} (${yearAqiLabel})`
                                    : "Χωρίς διαθέσιμη τιμή"}
                            </span>
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[#1a535c]/82">
                            Κυρίαρχος ρύπος έτους:{" "}
                            <span className="font-semibold">
                                {yearDominantPollutant
                                    ? POLLUTANT_LABELS[yearDominantPollutant] ?? yearDominantPollutant
                                    : "Χωρίς διαθέσιμη τιμή"}
                            </span>
                        </p>
                    </div>

                    {!!rows.length && (
                        <div className="mt-4 overflow-x-auto rounded-xl border border-cyan-100">
                            <table className="min-w-full text-left text-sm text-[#1a535c]/88">
                                <thead className="bg-cyan-50/70 text-xs uppercase tracking-wide text-[#1a535c]/72">
                                    <tr>
                                        <th className="px-4 py-2">Ρύπος</th>
                                        <th className="px-4 py-2">PI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row) => (
                                        <tr key={row.key} className="border-t border-cyan-100">
                                            <td className="px-4 py-2 font-medium">{row.label}</td>
                                            <td className="px-4 py-2">{row.value?.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
