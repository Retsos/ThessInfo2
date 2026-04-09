import type { StaticImageData } from "next/image"
import type { LucideIcon } from "lucide-react"
import {
    Database,
    Droplets,
    Recycle,
    RefreshCw,
    ShieldCheck,
    Wind,
} from "lucide-react"

import fogImage from "@/assets/fog.png"

export type FeatureTheme = "water" | "recycle" | "air"

export type FeatureCardItem = {
    title: string
    description: string
    href: string
    icon: LucideIcon
    eyebrow: string
    theme: FeatureTheme
    image?: StaticImageData
}

export const featureCards: FeatureCardItem[] = [
    {
        title: "Έλεγχος Ποιότητας Νερού",
        description:
            "Άμεση ενημέρωση για pH, χλώριο και βασικούς δείκτες, με στόχο καθαρό και ασφαλές νερό.",
        href: "/themes/water",
        icon: Droplets,
        eyebrow: "Νερό",
        theme: "water",
    },
    {
        title: "Διαχείριση Απορριμμάτων",
        description:
            "Ανακύκλωση, διαλογή και πιο πρακτική περιβαλλοντική οργάνωση για την καθημερινότητα της πόλης.",
        href: "/themes/recycle",
        icon: Recycle,
        eyebrow: "Ανακύκλωση",
        theme: "recycle",
    },
    {
        title: "Ατμοσφαιρική Ρύπανση",
        description:
            "Παρακολούθηση δεικτών PM2.5, NO₂ και O₃ με καθαρή παρουσίαση και γρήγορη κατανόηση.",
        href: "/themes/air",
        icon: Wind,
        eyebrow: "Αέρας",
        theme: "air",
        image: fogImage,
    },
]

export const trustItems = [
    {
        title: "Συνεχής ενημέρωση",
        description:
            "Τα δεδομένα παρουσιάζονται με έμφαση στην επικαιρότητα και στη γρήγορη ανάγνωση.",
        icon: RefreshCw,
    },
    {
        title: "Αξιόπιστες μετρήσεις",
        description:
            "Η πληροφόρηση στηρίζεται σε επίσημες πηγές και δείκτες με πραγματική χρησιμότητα.",
        icon: ShieldCheck,
    },
    {
        title: "Καθαρή παρουσίαση",
        description:
            "Λιγότερος θόρυβος, περισσότερη ουσία. Τα δεδομένα δεν είναι διακόσμηση.",
        icon: Database,
    },
]

export const faqItems = [
    {
        question: "Από πού προέρχονται τα δεδομένα;",
        answer:
            "Η πλατφόρμα σχεδιάζεται ώστε να αξιοποιεί επίσημες και αξιόπιστες πηγές, με στόχο καθαρή τοπική πληροφόρηση για τη Θεσσαλονίκη.",
    },
    {
        question: "Πόσο συχνά ενημερώνονται οι πληροφορίες;",
        answer:
            "Αυτό εξαρτάται από την κάθε πηγή. Η δομή του ThessInfo είναι φτιαγμένη ώστε να δέχεται ανανεώσεις και να δείχνει καθαρά την επικαιρότητα των δεδομένων.",
    },
    {
        question: "Το app αφορά μόνο τη Θεσσαλονίκη;",
        answer:
            "Ναι. Ο βασικός του χαρακτήρας είναι τοπικός, ώστε η πληροφορία να έχει συγκεκριμένη αξία και όχι να είναι ένα γενικό dashboard χωρίς ταυτότητα.",
    },
]
