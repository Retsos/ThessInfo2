"use client"

import { useState } from "react"
import Link from "next/link"
import {
    Clock3,
    Lightbulb,
    Mail,
    MessageSquareText,
    Send,
    ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type FormValues = {
    fullName: string
    email: string
    message: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const initialValues: FormValues = {
    fullName: "",
    email: "",
    message: "",
}

function validateForm(values: FormValues): FormErrors {
    const errors: FormErrors = {}

    if (!values.fullName.trim()) {
        errors.fullName = "Συμπλήρωσε το όνομά σου."
    } else if (values.fullName.trim().length < 2) {
        errors.fullName = "Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες."
    }

    if (!values.email.trim()) {
        errors.email = "Συμπλήρωσε το email σου."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
        errors.email = "Βάλε ένα έγκυρο email."
    }

    if (!values.message.trim()) {
        errors.message = "Γράψε ένα σύντομο μήνυμα."
    } else if (values.message.trim().length < 10) {
        errors.message = "Το μήνυμα πρέπει να έχει τουλάχιστον 10 χαρακτήρες."
    }

    return errors
}

const supportReasons = [
    "Έχεις ιδέα για νέα λειτουργία ή βελτίωση",
    "Κάτι δεν είναι ξεκάθαρο ή φαίνεται λάθος",
    "Εντόπισες bug ή περίεργη συμπεριφορά",
]

const betterReplyTips = [
    "Αν αναφέρεις πρόβλημα, πες μας πού το είδες και τι ακριβώς συνέβη",
    "Αν έχεις πρόταση, εξήγησε τι θα βελτίωνε και γιατί",
    "Αν μιλάς για δεδομένα, δώσε λίγο πλαίσιο, όπως περιοχή ή δείκτη",
]

export default function ContactPage() {
    const [values, setValues] = useState<FormValues>(initialValues)
    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitted, setIsSubmitted] = useState(false)

    function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
        setValues((current) => ({ ...current, [field]: value }))
        setErrors((current) => ({ ...current, [field]: undefined }))
        setIsSubmitted(false)
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const nextErrors = validateForm(values)
        setErrors(nextErrors)

        if (Object.keys(nextErrors).length > 0) {
            setIsSubmitted(false)
            return
        }

        setIsSubmitted(true)
        setValues(initialValues)
    }

    return (
        <div className="overflow-hidden bg-[linear-gradient(180deg,#f7fbfb_0%,#f3f8f8_42%,#ffffff_100%)]">
            <section className="relative overflow-hidden bg-[linear-gradient(135deg,#305f61_0%,#4a787a_48%,#88a7a6_100%)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_26%)]" />

                <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 md:px-6 md:pb-24 md:pt-20">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/95">
                            <MessageSquareText className="h-4 w-4" />
                            Επικοινωνία
                        </div>

                        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                            Στείλε μας μήνυμα
                        </h1>

                        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/92">
                            Έχεις απορία, βρήκες κάτι που δεν σου φαίνεται σωστό ή έχεις μια ιδέα που αξίζει να
                            ακουστεί;
                        </p>

                        <p className="mt-4 max-w-2xl text-base leading-7 text-white/84">
                            Γράψε μας. Διαβάζουμε κάθε μήνυμα και προσπαθούμε να απαντάμε ουσιαστικά και όχι απλά
                            τυπικά.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-[#cfe3e3] bg-white/90 p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] md:p-8">
                            <div className="max-w-2xl">
                                <h2 className="text-2xl font-semibold tracking-tight text-[#1a535c]">
                                    Φόρμα επικοινωνίας
                                </h2>
                                <p className="mt-2 text-sm leading-7 text-[#1a535c]/78">
                                    Συμπλήρωσε τα βασικά στοιχεία και πες μας τι έχεις στο μυαλό σου. Δεν χρειάζεται να
                                    το κάνεις τέλειο, απλά δώσε μας το context για να καταλάβουμε.
                                </p>
                            </div>

                            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-[#1a535c]">
                                        Ονοματεπώνυμο
                                    </Label>
                                    <Input
                                        id="fullName"
                                        value={values.fullName}
                                        onChange={(event) => updateField("fullName", event.target.value)}
                                        placeholder="Π.χ. Γιώργος Παπαδόπουλος"
                                        aria-invalid={Boolean(errors.fullName)}
                                        className="h-11 rounded-2xl border-[#d9e8e8] bg-white dark:bg-white px-4 text-[#1a535c] placeholder:text-[#5f7d80]"
                                    />
                                    {errors.fullName ? (
                                        <p className="text-sm text-[#b4534b]">{errors.fullName}</p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[#1a535c]">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={values.email}
                                        onChange={(event) => updateField("email", event.target.value)}
                                        placeholder="name@example.com"
                                        aria-invalid={Boolean(errors.email)}
                                        className="h-11 rounded-2xl border-[#d9e8e8] bg-white dark:bg-white px-4 text-[#1a535c] placeholder:text-[#5f7d80]"
                                    />
                                    {errors.email ? (
                                        <p className="text-sm text-[#b4534b]">{errors.email}</p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-[#1a535c]">
                                        Μήνυμα
                                    </Label>
                                    <Textarea
                                        id="message"
                                        value={values.message}
                                        onChange={(event) => updateField("message", event.target.value)}
                                        placeholder="Γράψε εδώ το μήνυμά σου..."
                                        aria-invalid={Boolean(errors.message)}
                                        className="min-h-40 resize-none rounded-2xl border-[#d9e8e8] bg-white dark:bg-white px-4 py-3 text-sm text-[#1a535c] placeholder:text-[#5f7d80] focus-visible:border-[#6da5a6] focus-visible:ring-[#6da5a6]/15"
                                    />
                                    {errors.message ? (
                                        <p className="text-sm text-[#b4534b]">{errors.message}</p>
                                    ) : null}
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm leading-6 text-[#1a535c]/70">
                                        Τα δεδομένα της φόρμας είναι οργανωμένα σε καθαρή μορφή και γίνεται βασικός
                                        έλεγχος πριν την αποστολή.
                                    </p>

                                    <Button
                                        type="submit"
                                        className="h-11 rounded-full bg-[#2f6d70] px-6 text-sm font-semibold text-white hover:bg-[#285d60]"
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        Αποστολή
                                    </Button>
                                </div>

                                {isSubmitted ? (
                                    <div className="rounded-2xl border border-[#dbe8e1] bg-[#f4faf6] px-4 py-3 text-sm leading-7 text-[#1f5f48]">
                                        Αν χρειάζεται απάντηση, θα επανέλθουμε σύντομα. Μέχρι τότε, μπορείς να
                                        συνεχίσεις την εξερεύνηση της πλατφόρμας.
                                    </div>
                                ) : null}
                            </form>
                        </div>

                        <div className="rounded-3xl border border-[#d9e8e8]/70 bg-white/90 p-6 opacity-[0.97] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] md:p-8">
                            <h2 className="text-2xl font-semibold tracking-tight text-[#1a535c]">
                                Πώς να πάρεις καλύτερη απάντηση
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-[#1a535c]/78">
                                Λίγο context αρκεί για να καταλάβουμε πιο γρήγορα τι εννοείς και να απαντήσουμε πιο
                                ουσιαστικά.
                            </p>

                            <div className="mt-5 space-y-3">
                                {betterReplyTips.map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-2xl border border-white/80 bg-white px-4 py-3 text-sm leading-7 text-[#1a535c]/80"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-[#d9e8e8]/70 bg-[linear-gradient(180deg,#ffffff_0%,#eef6f6_100%)] p-6 opacity-[0.97] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] md:p-8">
                            <h2 className="text-2xl font-semibold tracking-tight text-[#1a535c]">
                                Πότε έχει νόημα να επικοινωνήσεις
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-[#1a535c]/78">
                                Η φόρμα είναι ο πιο άμεσος τρόπος για να μας πεις κάτι που μπορεί να κάνει την
                                πλατφόρμα καλύτερη ή πιο καθαρή στην εμπειρία της.
                            </p>

                            <div className="mt-5 space-y-3">
                                {supportReasons.map((item, index) => {
                                    const icons = [Lightbulb, Mail, ShieldCheck]
                                    const Icon = icons[index]

                                    return (
                                        <div
                                            key={item}
                                            className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white px-4 py-4"
                                        >
                                            <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef7f7] text-[#2f6d70]">
                                                <Icon className="h-5 w-5" />
                                            </span>
                                            <p className="text-sm leading-7 text-[#1a535c]/80">{item}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#d9e8e8]/70 bg-white/90 p-6 opacity-[0.97] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] md:p-8">
                            <h2 className="text-2xl font-semibold tracking-tight text-[#1a535c]">
                                Τι γίνεται μετά
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-[#1a535c]/78">
                                Τα μηνύματα καταγράφονται και εξετάζονται ώστε να βελτιώνεται συνεχώς η πλατφόρμα.
                            </p>

                            <div className="mt-5 space-y-3">
                                <div className="flex items-start gap-3 rounded-2xl border border-[#e3eeee] bg-[#fbfdfd] px-4 py-4">
                                    <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef7f7] text-[#2f6d70]">
                                        <Clock3 className="h-5 w-5" />
                                    </span>
                                    <p className="text-sm leading-7 text-[#1a535c]/76">
                                        Σε επόμενο στάδιο, η επικοινωνία θα συνδεθεί με πλήρες σύστημα υποστήριξης και
                                        διαχείρισης αιτημάτων.
                                    </p>
                                </div>

                                <div className="mt-6">
                                    <Link
                                        href="/about"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6d70] transition-colors hover:text-[#234f52]"
                                    >
                                        Επιστροφή στα σχετικά
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
