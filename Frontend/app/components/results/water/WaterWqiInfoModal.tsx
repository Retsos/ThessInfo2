"use client"

type WqiRule = {
    parameter: string
    si: number
    ideal: number
    weight: number
}

type Props = {
    open: boolean
    onClose: () => void
    rules: WqiRule[]
    selectedYear: string | null
    yearMeasurements: number
}

export default function WaterWqiInfoModal({
    open,
    onClose,
    rules,
    selectedYear,
    yearMeasurements,
}: Props) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/35 px-4 py-6 backdrop-blur-[2px]">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-sky-100 bg-white shadow-2xl">
                
                {/* HEADER */}
                <div className="flex items-start justify-between gap-4 border-b border-sky-100 px-6 py-5">
                    <div>
                        <h4 className="text-xl font-semibold text-[#1a535c]">
                            Υπολογισμός Δείκτη Ποιότητας Νερού (WQI)
                        </h4>
                        <p className="mt-1 text-sm text-[#1a535c]/72">
                            Αναλυτική επεξήγηση της μεθοδολογίας υπολογισμού του δείκτη ποιότητας νερού.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-sky-200 bg-white text-sky-800 transition hover:bg-sky-50"
                        aria-label="Κλείσιμο"
                    >
                        ✕
                    </button>
                </div>

                {/* CONTENT */}
                <div className="max-h-[calc(90vh-88px)] overflow-y-auto px-6 py-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#cfe9ea] hover:[&::-webkit-scrollbar-thumb]:bg-[#1daaad]">

                    {/* FORMULA */}
                    <p className="text-sm leading-6 text-[#1a535c]/82">
                        Ο δείκτης ποιότητας νερού (<span className="font-semibold">WQI</span>) υπολογίζεται
                        για κάθε παράμετρο μέσω του επιμέρους δείκτη ποιότητας:
                        {" "}
                        <code>qi = 100 × ((value - ideal) / (Si - ideal))</code>.
                        {" "}
                        Στη συνέχεια, ο συνολικός δείκτης προκύπτει ως σταθμισμένος μέσος όρος:
                        {" "}
                        <code>WQI = Σ(Wi × qi) / Σ(Wi)</code>.
                    </p>

                    {/* EXPLANATION */}
                    <p className="mt-3 text-sm leading-6 text-[#1a535c]/82">
                        Κάθε παράμετρος περιγράφεται από:
                    </p>

                    <ul className="mt-2 space-y-1 pl-5 text-sm leading-6 text-[#1a535c]/82 list-disc">
                        <li>
                            <span className="font-medium">Τιμή αναφοράς (Si)</span>, που εκφράζει το επιτρεπτό όριο,
                        </li>
                        <li>
                            <span className="font-medium">Ιδανική τιμή</span>, που αντιστοιχεί στην άριστη ποιότητα,
                        </li>
                        <li>
                            <span className="font-medium">Βάρος σημαντικότητας (Wi)</span>, που καθορίζει τη συμβολή της παραμέτρου στον συνολικό δείκτη.
                        </li>
                    </ul>

                    <p className="mt-3 text-sm leading-6 text-[#1a535c]/82">
                        Η αντιστοίχιση των μετρούμενων παραμέτρων με τους κανόνες υπολογισμού γίνεται βάσει της ονομασίας τους.
                        Σε περιπτώσεις όπου δεν υπάρχουν διαθέσιμες μετρήσεις για κάποια παράμετρο, αυτή δεν συμμετέχει στον υπολογισμό.
                    </p>

                    {/* TABLE */}
                    <div className="mt-4 overflow-x-auto rounded-xl border border-sky-100">
                        <table className="min-w-full text-left text-sm text-[#1a535c]/88">
                            <thead className="bg-sky-50/70 text-xs uppercase tracking-wide text-[#1a535c]/72">
                                <tr>
                                    <th className="px-4 py-2">Παράμετρος</th>
                                    <th className="px-4 py-2">Τιμή αναφοράς (Si)</th>
                                    <th className="px-4 py-2">Ιδανική τιμή</th>
                                    <th className="px-4 py-2">Βάρος (Wi)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rules.map((rule) => (
                                    <tr key={rule.parameter} className="border-t border-sky-100">
                                        <td className="px-4 py-2 font-medium">{rule.parameter}</td>
                                        <td className="px-4 py-2">{rule.si}</td>
                                        <td className="px-4 py-2">{rule.ideal}</td>
                                        <td className="px-4 py-2">{rule.weight}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* CLASSIFICATION */}
                    <p className="mt-4 text-sm leading-6 text-[#1a535c]/82">
                        Η τελική τιμή του δείκτη ερμηνεύεται ως εξής:
                    </p>

                    <div className="mt-2 rounded-xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm leading-6 text-[#1a535c]/85">
                        <div><span className="font-semibold">0 – 25:</span> Εξαιρετική ποιότητα</div>
                        <div><span className="font-semibold">26 – 50:</span> Καλή ποιότητα</div>
                        <div><span className="font-semibold">51 – 75:</span> Μέτρια ποιότητα</div>
                        <div><span className="font-semibold">76 – 100:</span> Κακή ποιότητα</div>
                        <div><span className="font-semibold">{`> 100:`}</span> Ακατάλληλο νερό</div>
                    </div>

                    {/* YEAR INFO */}
                    <p className="mt-4 text-sm leading-6 text-[#1a535c]/82">
                        {selectedYear
                            ? `Για το έτος ${selectedYear}, ο συνολικός δείκτης WQI υπολογίζεται από όλες τις διαθέσιμες μετρήσεις (${yearMeasurements} καταγραφές δεδομένων).`
                            : "Επιλέξτε χρονική περίοδο για να εμφανιστεί η αντίστοιχη ανάλυση του δείκτη."}
                    </p>
                </div>
            </div>
        </div>
    )
}
