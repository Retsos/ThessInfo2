"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Droplets, Recycle, Wind } from "lucide-react"

import type { RegionCatalogItem } from "./../../data/region-catalog"

type TabId = "water" | "recycle" | "air"

type Props = {
    region: RegionCatalogItem
}

const tabMeta = {
    water: {
        title: "Ποιότητα Νερού",
        description:
            "Εδώ θα μπουν οι τελευταίες μετρήσεις, οι βασικοί δείκτες και οι μελλοντικές οπτικοποιήσεις νερού.",
        icon: Droplets,
        bubbleClass: "bg-sky-100 text-sky-700",
        borderClass: "border-sky-200",
        softBgClass: "bg-sky-50/70",
        accentText: "text-sky-700",
    },
    recycle: {
        title: "Ανακύκλωση",
        description:
            "Εδώ θα μπουν στοιχεία για απορρίμματα, ανακύκλωση, αποδόσεις ανά περιοχή και σχετικές συγκρίσεις.",
        icon: Recycle,
        bubbleClass: "bg-emerald-100 text-emerald-700",
        borderClass: "border-emerald-200",
        softBgClass: "bg-emerald-50/70",
        accentText: "text-emerald-700",
    },
    air: {
        title: "Ποιότητα Αέρα",
        description:
            "Εδώ θα μπουν οι βασικοί ατμοσφαιρικοί δείκτες, οι τελευταίες μετρήσεις και οι τάσεις ανά περίοδο.",
        icon: Wind,
        bubbleClass: "bg-cyan-100 text-cyan-700",
        borderClass: "border-cyan-200",
        softBgClass: "bg-cyan-50/70",
        accentText: "text-cyan-700",
    },
} satisfies Record<
    TabId,
    {
        title: string
        description: string
        icon: React.ComponentType<{ className?: string }>
        bubbleClass: string
        borderClass: string
        softBgClass: string
        accentText: string
    }
>

export function RegionResults({ region }: Props) {
    const availableTabs = useMemo(() => {
        const tabs: TabId[] = []

        if (region.availability.water) tabs.push("water")
        if (region.availability.recycle) tabs.push("recycle")
        if (region.availability.air) tabs.push("air")

        return tabs
    }, [region])

    const [activeTab, setActiveTab] = useState<TabId>(availableTabs[0])

    const current = tabMeta[activeTab]
    const CurrentIcon = current.icon

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
            <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full bg-[#eefafa] px-4 py-2 text-sm font-semibold text-[#006264] transition-colors hover:bg-[#e3f7f7]"
            >
                <ArrowLeft className="h-4 w-4" />
                Επιστροφή στις υπηρεσίες
            </Link>

            <div className="mt-6 rounded-[1.7rem] border border-[#d7eff0] bg-white p-6 shadow-[0_20px_50px_rgba(29,170,173,0.1)] md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1daaad]">
                            Αποτελέσματα περιοχής
                        </p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#1a535c] md:text-4xl">
                            {region.label}
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#1a535c]/78 md:text-base">
                            Αυτή η σελίδα είναι η σωστή βάση για να δέσεις μετά API calls,
                            summaries, charts και ετήσιες συγκρίσεις. Πρώτα όμως πρέπει να
                            στέκει η πληροφορία και μετά να πετάξουμε πάνω της γραφήματα.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {region.availability.water && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1.5 text-sm font-semibold text-sky-700">
                                <Droplets className="h-4 w-4" />
                                Νερό
                            </span>
                        )}

                        {region.availability.recycle && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                                <Recycle className="h-4 w-4" />
                                Ανακύκλωση
                            </span>
                        )}

                        {region.availability.air && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1.5 text-sm font-semibold text-cyan-700">
                                <Wind className="h-4 w-4" />
                                Αέρας
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                    {availableTabs.map((tab) => {
                        const meta = tabMeta[tab]
                        const Icon = meta.icon
                        const isActive = activeTab === tab

                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={[
                                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                                    isActive
                                        ? `${meta.borderClass} ${meta.softBgClass} ${meta.accentText}`
                                        : "border-[#d7eff0] bg-white text-[#1a535c]/75 hover:bg-[#f7fcfc]",
                                ].join(" ")}
                            >
                                <Icon className="h-4 w-4" />
                                {meta.title}
                            </button>
                        )
                    })}
                </div>

                <div className={`mt-8 rounded-[1.5rem] border ${current.borderClass} ${current.softBgClass} p-6`}>
                    <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${current.bubbleClass}`}>
                            <CurrentIcon className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-[#1a535c]">
                                {current.title}
                            </h2>
                            <p className="mt-2 max-w-3xl text-sm leading-7 text-[#1a535c]/80 md:text-base">
                                {current.description}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm">
                            <h3 className="text-base font-semibold text-[#1a535c]">
                                Τελευταία εικόνα
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-[#1a535c]/78">
                                Εδώ θα μπει summary card με τα πιο πρόσφατα δεδομένα για την περιοχή.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm">
                            <h3 className="text-base font-semibold text-[#1a535c]">
                                Χρονική πορεία
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-[#1a535c]/78">
                                Εδώ θα μπουν τάσεις, σύγκριση ανά μήνα ή έτος και μικρά charts.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm">
                            <h3 className="text-base font-semibold text-[#1a535c]">
                                Βασικοί δείκτες
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-[#1a535c]/78">
                                Εδώ θα μπουν τα κύρια metrics με πιο ανθρώπινη εξήγηση.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}