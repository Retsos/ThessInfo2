import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { featureCards, type FeatureTheme } from "./home-data"

const themeStyles: Record<
    FeatureTheme,
    {
        card: string
        topBar: string
        bubble: string
        icon: string
        eyebrow: string
        link: string
        shadow: string
    }
> = {
    water: {
        card: "border-sky-100 bg-gradient-to-b from-white to-sky-50/80",
        topBar: "from-sky-400 via-cyan-400 to-teal-400",
        bubble: "bg-sky-100",
        icon: "text-sky-700",
        eyebrow: "text-sky-700",
        link: "text-sky-700",
        shadow: "hover:shadow-[0_18px_45px_rgba(56,189,248,0.18)]",
    },
    recycle: {
        card: "border-teal-100 bg-gradient-to-b from-white to-teal-50/80",
        topBar: "from-teal-400 via-cyan-400 to-emerald-300",
        bubble: "bg-teal-100",
        icon: "text-teal-700",
        eyebrow: "text-teal-700",
        link: "text-teal-700",
        shadow: "hover:shadow-[0_18px_45px_rgba(29,170,173,0.18)]",
    },
    air: {
        card: "border-cyan-100 bg-gradient-to-b from-white to-cyan-50/80",
        topBar: "from-cyan-400 via-sky-400 to-teal-500",
        bubble: "bg-cyan-100",
        icon: "text-cyan-700",
        eyebrow: "text-cyan-700",
        link: "text-cyan-700",
        shadow: "hover:shadow-[0_18px_45px_rgba(14,165,233,0.18)]",
    },
}

export function FeatureGrid() {
    return (
        <section
            id="sections"
            className="relative z-20 mx-auto -mt-12 max-w-7xl px-4 pb-14 md:-mt-16 md:px-6 md:pb-20"
        >
            <div className="grid gap-6 md:grid-cols-3">
                {featureCards.map((item) => {
                    const Icon = item.icon
                    const styles = themeStyles[item.theme]

                    return (
                        <Link key={item.title} href={item.href} className="group block">
                            <Card
                                className={[
                                    "h-full overflow-hidden rounded-[1.4rem] border transition-all duration-250 hover:-translate-y-1",
                                    styles.card,
                                    styles.shadow,
                                ].join(" ")}
                            >
                                <div className={`h-1.5 w-full bg-gradient-to-r ${styles.topBar}`} />

                                <CardHeader className="relative pb-4">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles.bubble}`}
                                        >
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt=""
                                                    width={24}
                                                    height={24}
                                                    className="h-6 w-6 object-contain"
                                                />
                                            ) : (
                                                <Icon className={`h-5 w-5 ${styles.icon}`} />
                                            )}
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold tracking-[0.16em] uppercase ${styles.eyebrow} bg-white/70`}
                                        >
                                            {item.eyebrow}
                                        </span>
                                    </div>

                                    <CardTitle className="text-xl font-semibold text-[#1a535c]">
                                        {item.title}
                                    </CardTitle>

                                    <CardDescription className="text-sm leading-6 text-[#1a535c]/78">
                                        {item.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div
                                        className={`inline-flex items-center text-sm font-semibold ${styles.link}`}
                                    >
                                        Προβολή ενότητας
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