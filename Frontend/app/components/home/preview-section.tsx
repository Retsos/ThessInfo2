"use client"

import Link from "next/link"
import { ArrowRight, Map, Trophy } from "lucide-react"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"

const previewCards = [
    {
        title: "Χάρτης περιοχών",
        description:
            "Δες συγκεντρωμένα δεδομένα για κάθε περιοχή της πόλης μέσα από έναν καθαρό και διαδραστικό χάρτη.",
        icon: Map,
        href: "/map",
        accent: "from-sky-400 via-cyan-400 to-teal-400",
        bg: "from-white to-sky-50/80",
        border: "border-sky-100",
        text: "text-sky-700",
    },
    {
        title: "Καλύτερες περιοχές",
        description:
            "Κατάταξη περιοχών με βάση τον συνολικό δείκτη ποιότητας από αέρα, νερό και ανακύκλωση.",
        icon: Trophy,
        href: "/leaderboard",
        accent: "from-emerald-400 via-teal-400 to-cyan-400",
        bg: "from-white to-teal-50/80",
        border: "border-teal-100",
        text: "text-teal-700",
    },
]

export function AreaPreviewSection() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
            <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1daaad]">
                    Περιοχές & δεδομένα
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1a535c] md:text-4xl">
                    Δες την πόλη όπως πραγματικά είναι
                </h2>

                <p className="mt-4 text-base leading-7 text-[#1a535c]/80">
                    Συγκεντρώνουμε δεδομένα και τα μετατρέπουμε σε κάτι που διαβάζεται εύκολα.
                    Χάρτης, συγκρίσεις και συνολική εικόνα χωρίς περιττό χάος.
                </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
                {previewCards.map((card) => {
                    const Icon = card.icon

                    return (
                        <Link key={card.title} href={card.href} className="group block">
                            <Card
                                className={`h-full overflow-hidden rounded-[1.5rem] border ${card.border} bg-gradient-to-b ${card.bg} transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]`}
                            >
                                <div
                                    className={`h-1.5 w-full bg-gradient-to-r ${card.accent}`}
                                />

                                <CardHeader>
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                                            <Icon className={`h-5 w-5 ${card.text}`} />
                                        </div>
                                    </div>

                                    <CardTitle className="text-xl font-semibold text-[#1a535c]">
                                        {card.title}
                                    </CardTitle>

                                    <CardDescription className="text-sm leading-6 text-[#1a535c]/78">
                                        {card.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div
                                        className={`inline-flex items-center text-sm font-semibold ${card.text}`}
                                    >
                                        Μετάβαση
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}