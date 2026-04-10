"use client"

import Link from "next/link"
import { CircleHelp } from "lucide-react"
import type { MetricKey } from "../map-types"
import { metricOptions } from "../map-metrics"

export function MetricSwitcher({
  activeMetric,
  infoButtonLabel,
  onOpenInfo,
}: {
  activeMetric: MetricKey
  infoButtonLabel: string
  onOpenInfo: () => void
}) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1daaad]">Επιλογή προβολής</p>
        <button
          type="button"
          onClick={onOpenInfo}
          className="inline-flex items-center gap-2 rounded-full border border-[#d7eff0] bg-[#f4fbfb] px-4 py-1.5 text-sm font-semibold text-[#1a535c] hover:bg-[#eaf8f8]"
        >
          <CircleHelp className="h-4 w-4" />
          {infoButtonLabel}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {metricOptions.map((option) => {
          const Icon = option.icon
          const isActive = option.key === activeMetric
          return (
            <Link
              key={option.key}
              href={`/map?metric=${option.key}`}
              className={[
                "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-all",
                isActive
                  ? "border-[#1daaad] bg-[#e9fbfb] text-[#1a535c] shadow-sm"
                  : "border-[#d6ecec] bg-white text-[#1a535c]/82 hover:bg-[#f4fbfb]",
              ].join(" ")}
            >
              <span className={["h-1.5 w-1.5 rounded-full", isActive ? "bg-[#1daaad]" : "bg-transparent"].join(" ")} />
              <Icon className={`h-4 w-4 ${option.color}`} />
              {option.label}
            </Link>
          )
        })}
      </div>
    </>
  )
}

