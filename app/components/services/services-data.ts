import {
    ArrowRight,
    Droplets,
    MapPinned,
    Recycle,
    Search,
    Trophy,
    Wind,
} from "lucide-react"

export const serviceCards = [
    {
        title: "Ποιότητα Νερού",
        description:
            "Δείκτες όπως pH, χλώριο, θολότητα και γενική εικόνα ποιότητας για κάθε διαθέσιμη περιοχή.",
        icon: Droplets,
        bubbleClass: "bg-sky-100 text-sky-700",
        borderClass: "border-sky-100",
        gradientClass: "from-sky-400 via-cyan-400 to-teal-400",
    },
    {
        title: "Ανακύκλωση",
        description:
            "Στοιχεία για διαχείριση απορριμμάτων, ανακυκλώσιμα υλικά και συνολική περιβαλλοντική απόδοση.",
        icon: Recycle,
        bubbleClass: "bg-emerald-100 text-emerald-700",
        borderClass: "border-emerald-100",
        gradientClass: "from-emerald-400 via-teal-400 to-cyan-400",
    },
    {
        title: "Ποιότητα Αέρα",
        description:
            "Ατμοσφαιρικοί δείκτες και συνοπτική εικόνα για την ποιότητα του αέρα στις διαθέσιμες ζώνες.",
        icon: Wind,
        bubbleClass: "bg-cyan-100 text-cyan-700",
        borderClass: "border-cyan-100",
        gradientClass: "from-cyan-400 via-sky-400 to-teal-500",
    },
]

export const bestRegionMocks = [
    {
        title: "Καλύτερη περιοχή νερού",
        description: "Περιοχή με τις καλύτερες διαθέσιμες ενδείξεις ποιότητας νερού.",
        accentClass: "from-sky-500 to-cyan-500",
        textClass: "text-sky-700",
        icon: Trophy,
    },
    {
        title: "Καλύτερη περιοχή ανακύκλωσης",
        description: "Περιοχή με την πιο αποδοτική περιβαλλοντική εικόνα στην ανακύκλωση.",
        accentClass: "from-emerald-500 to-teal-500",
        textClass: "text-emerald-700",
        icon: Trophy,
    },
    {
        title: "Καλύτερη περιοχή αέρα",
        description: "Περιοχή με την καθαρότερη διαθέσιμη ατμοσφαιρική εικόνα.",
        accentClass: "from-cyan-500 to-sky-500",
        textClass: "text-cyan-700",
        icon: Trophy,
    },
]

export const steps = [
    {
        title: "Αναζήτησε περιοχή",
        description:
            "Γράφεις δήμο ή περιοχή και επιλέγεις από τη λίστα τα διαθέσιμα αποτελέσματα.",
        icon: Search,
    },
    {
        title: "Δες διαθέσιμες θεματικές",
        description:
            "Το σύστημα δείχνει αν υπάρχουν δεδομένα για νερό, ανακύκλωση και αέρα.",
        icon: MapPinned,
    },
    {
        title: "Προχώρα στα αποτελέσματα",
        description:
            "Η σελίδα αποτελεσμάτων είναι η βάση όπου μετά θα κουμπώσουν summaries, charts και αναλύσεις.",
        icon: ArrowRight,
    },
]