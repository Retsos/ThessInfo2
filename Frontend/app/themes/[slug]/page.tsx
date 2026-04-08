import Link from "next/link"
import { ArrowRight, ChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"

import {
    themeOrder,
    themePages,
    themeSupportItems,
    type ThemeSlug,
} from "../../components/themes/themes-data"

type Props = {
    params: Promise<{ slug: string }>
}

function isThemeSlug(value: string): value is ThemeSlug {
    return value in themePages
}

export default async function ThemePage({ params }: Props) {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)

    if (!isThemeSlug(decodedSlug)) {
        notFound()
    }

    const theme = themePages[decodedSlug]
    const Icon = theme.icon
    const relatedThemes = themeOrder.filter((item) => item !== theme.slug).map((item) => themePages[item])

    return (
        <div className={`min-h-[calc(100vh-4rem)] overflow-hidden ${theme.pageBgClass}`}>
            <section className={`relative overflow-hidden bg-gradient-to-br ${theme.accentClass}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_26%)]" />

                <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-14 md:px-6 md:pb-24 md:pt-18">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/8 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/12"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Όλες οι υπηρεσίες
                    </Link>

                    <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/94">
                                <Icon className="h-4 w-4" />
                                {theme.eyebrow}
                            </div>

                            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                                {theme.title}
                            </h1>

                            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/92">
                                {theme.intro}
                            </p>

                            <p className="mt-4 max-w-2xl text-base leading-7 text-white/84">
                                {theme.description}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                {theme.actions.map((action) => {
                                    const ActionIcon = action.icon

                                    return (
                                        <Link
                                            key={action.href}
                                            href={action.href}
                                            className={
                                                action.variant === "secondary"
                                                    ? "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/18 bg-white/8 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/12"
                                                    : "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/92 px-6 text-sm font-semibold text-[#24474f] shadow-[0_12px_24px_rgba(0,0,0,0.10)] transition-all hover:-translate-y-0.5"
                                            }
                                        >
                                            <ActionIcon className="h-4 w-4" />
                                            {action.label}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                            {theme.stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-[1.5rem] border border-white/14 bg-white/10 px-5 py-4 text-white shadow-[0_14px_28px_rgba(0,0,0,0.07)] backdrop-blur-sm"
                                >
                                    <p className="text-sm text-white/72">{stat.label}</p>
                                    <p className="mt-2 text-lg font-semibold">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-[2rem] border border-[#d8eff0] bg-white p-6 shadow-sm md:p-8">
                        <h2 className="text-2xl font-semibold tracking-tight text-[#1a535c]">
                            Τι θα βρει ο χρήστης εδώ
                        </h2>

                        <div className="mt-6 space-y-4">
                            {theme.keyPoints.map((item) => (
                                <div
                                    key={item.title}
                                    className={`rounded-[1.4rem] border px-5 py-4 ${theme.surfaceClass}`}
                                >
                                    <h3 className="text-base font-semibold">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-7 text-current/80">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`rounded-[2rem] border p-6 shadow-sm md:p-8 ${theme.softPanelClass}`}>
                        <h2 className="text-2xl font-semibold tracking-tight text-[#1a535c]">
                            Highlights της θεματικής
                        </h2>

                        <div className="mt-6 space-y-4">
                            {theme.highlights.map((item) => (
                                <div key={item.title} className="rounded-[1.4rem] border border-white/70 bg-white px-5 py-4">
                                    <h3 className="text-base font-semibold text-[#1a535c]">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-7 text-[#1a535c]/78">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {!!theme.variables?.length && (
                <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6 md:pb-16">
                    <div className="rounded-[2rem] border border-[#d8eff0] bg-white p-6 shadow-sm md:p-8">
                        <div className="max-w-3xl">
                            <h2 className="text-2xl font-semibold tracking-tight text-[#1a535c]">
                                Ποιες μεταβλητές δείχνουμε και πώς τις εξηγούμε
                            </h2>
                            <p className="mt-2 text-sm leading-7 text-[#1a535c]/78">
                                Εδώ είναι το σωστό σημείο για να εξηγούμε στον χρήστη τι μετράμε, τι σημαίνει κάθε μεταβλητή και γιατί έχει αξία για τη συνολική εικόνα.
                            </p>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {theme.variables.map((variable) => (
                                <div
                                    key={variable.name}
                                    className={`rounded-[1.5rem] border px-5 py-5 ${theme.surfaceClass}`}
                                >
                                    <h3 className="text-base font-semibold">{variable.name}</h3>
                                    <p className="mt-3 text-sm leading-7 text-current/82">
                                        <span className="font-semibold">Τι δείχνει:</span> {variable.meaning}
                                    </p>
                                    <p className="mt-2 text-sm leading-7 text-current/82">
                                        <span className="font-semibold">Γιατί έχει σημασία:</span> {variable.whyItMatters}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {theme.indexInfo && (
                <section
                    id={theme.slug === "water" ? "wqi" : theme.slug === "air" ? "aqi" : undefined}
                    className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-12 md:px-6 md:pb-16"
                >
                    <div className={`rounded-[2rem] border p-6 shadow-sm md:p-8 ${theme.softPanelClass}`}>
                        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight text-[#1a535c]">
                                    {theme.indexInfo.title} ({theme.indexInfo.shortName})
                                </h2>
                                <p className="mt-3 text-sm leading-7 text-[#1a535c]/82">
                                    {theme.indexInfo.summary}
                                </p>
                                <p className="mt-3 text-sm leading-7 text-[#1a535c]/82">
                                    <span className="font-semibold">Χρησιμότητα:</span> {theme.indexInfo.usefulness}
                                </p>

                                <div className="mt-5 space-y-3">
                                    {theme.indexInfo.howToExplain.map((item) => (
                                        <div
                                            key={item}
                                            className="rounded-[1.3rem] border border-white/75 bg-white px-4 py-3 text-sm leading-7 text-[#1a535c]/82"
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[1.8rem] border border-white/75 bg-white p-5">
                                <h3 className="text-lg font-semibold text-[#1a535c]">
                                    Ερμηνεία δείκτη
                                </h3>

                                <div className="mt-4 space-y-3">
                                    {theme.indexInfo.bands.map((band) => (
                                        <div
                                            key={`${band.range}-${band.label}`}
                                            className="rounded-[1.2rem] border border-[#e1f0f2] bg-[#fbfeff] px-4 py-3"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-sm font-semibold text-[#1a535c]">{band.range}</span>
                                                <span className="text-sm font-medium text-[#006264]">{band.label}</span>
                                            </div>
                                            <p className="mt-2 text-sm leading-7 text-[#1a535c]/78">{band.note}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6 md:pb-16">
                <div className="rounded-[2rem] border border-[#d8eff0] bg-white p-6 shadow-sm md:p-8">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight text-[#1a535c]">
                                Γιατί αυτή η σελίδα πριν από τα δεδομένα
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#1a535c]/78">
                                Η θεματική landing page δίνει πλαίσιο, μειώνει το μπέρδεμα και βοηθά τον χρήστη να καταλάβει τι θα δει πριν περάσει στις πιο αναλυτικές προβολές.
                            </p>
                        </div>

                        <Link
                            href="/services"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#1daaad] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(29,170,173,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#179ca0]"
                        >
                            Συνέχεια στα αποτελέσματα
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {themeSupportItems.map((item) => {
                            const ItemIcon = item.icon

                            return (
                                <div
                                    key={item.title}
                                    className="rounded-[1.4rem] border border-[#e3f2f2] bg-[linear-gradient(180deg,#fcffff_0%,#f7fcfc_100%)] px-5 py-5"
                                >
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ebfbfb] text-[#1daaad]">
                                        <ItemIcon className="h-5 w-5" />
                                    </span>
                                    <h3 className="mt-4 text-base font-semibold text-[#1a535c]">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-7 text-[#1a535c]/78">{item.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
                <div className="grid gap-4 md:grid-cols-2">
                    {relatedThemes.map((item) => {
                        const RelatedIcon = item.icon

                        return (
                            <Link
                                key={item.slug}
                                href={`/themes/${item.slug}`}
                                className="group rounded-[1.8rem] border border-[#d8eff0] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(29,170,173,0.10)]"
                            >
                                <div className="flex items-start gap-4">
                                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eefafa] text-[#1daaad]">
                                        <RelatedIcon className="h-5 w-5" />
                                    </span>

                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-[#1daaad]">Σχετική θεματική</p>
                                        <h3 className="mt-1 text-xl font-semibold text-[#1a535c]">{item.title}</h3>
                                        <p className="mt-3 text-sm leading-7 text-[#1a535c]/78">{item.intro}</p>
                                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#006264] transition-transform group-hover:translate-x-0.5">
                                            Άνοιγμα σελίδας
                                            <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}
