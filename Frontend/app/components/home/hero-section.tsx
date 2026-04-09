import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Waves } from "lucide-react"

import heroImage from "@/assets/menu-photo.jpg"

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20">
        <Image
          src={heroImage}
          alt="Θεσσαλονίκη"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(44,153,155,0.82),rgba(29,170,173,0.74),rgba(0,98,100,0.86))]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(186,230,253,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.10),transparent_28%)]" />

      <div className="mx-auto flex min-h-[72svh] max-w-7xl items-center justify-center px-4 py-16 text-center md:px-6 md:py-24">
        <div className="max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-white/20 bg-white/12 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            Περιβαλλοντική πληροφόρηση για τη Θεσσαλονίκη
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white drop-shadow-sm md:text-6xl">
            ThessInfo
          </h1>

          <h2 className="mt-3 text-xl font-medium text-white/95 md:text-3xl">
            Ποιότητα αέρα, νερού και περιβαλλοντικής καθημερινότητας
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
            Πραγματικές μετρήσεις, άμεση ενημέρωση και καθαρή οργάνωση της
            περιβαλλοντικής εικόνας της πόλης. Όχι μουντή βιτρίνα, όχι οπτικός
            θόρυβος. Χρήσιμη πληροφορία.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/services"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#006264] shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:bg-[#f1fafa]"
            >
              Αναζήτηση περιοχής
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/learn-more"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/18"
            >
              Μάθε περισσότερα
              <Waves className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full border border-white/15 bg-white/12 px-3 py-1.5 text-sm text-white/95 backdrop-blur-sm">
              Αέρας
            </span>
            <span className="rounded-full border border-white/15 bg-white/12 px-3 py-1.5 text-sm text-white/95 backdrop-blur-sm">
              Νερό
            </span>
            <span className="rounded-full border border-white/15 bg-white/12 px-3 py-1.5 text-sm text-white/95 backdrop-blur-sm">
              Ανακύκλωση
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
