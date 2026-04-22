"use client"

import { useMemo } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import type { WaterOverallWQIResponse } from "./water-types"

type Props = {
  overallByYear: Record<string, WaterOverallWQIResponse>
}

export default function WaterYearlyChart({ overallByYear }: Props) {
  const chartData = useMemo(
    () =>
      Object.values(overallByYear)
        .map((entry) => ({
          year: entry.year,
          score: entry.overall_wqi?.score ?? null,
          rating: entry.overall_wqi?.rating ?? "Unknown",
        }))
        .sort((a, b) => a.year.localeCompare(b.year)),
    [overallByYear]
  )

  const yDomain = useMemo<[number, number]>(() => {
    const scores = chartData
      .map((d) => d.score)
      .filter((v): v is number => typeof v === "number")

    if (!scores.length) return [0, 100]

    const min = Math.min(...scores)
    const max = Math.max(...scores)
    const range = max - min

    // Keep full scale for wide ranges, but zoom for tightly packed values.
    if (range >= 20) return [0, 100]

    if (range === 0) {
      const pad = min < 10 ? 1 : 2
      return [Math.max(0, min - pad), Math.min(100, max + pad)]
    }

    const pad = Math.max(1, range * 0.35)
    return [Math.max(0, min - pad), Math.min(100, max + pad)]
  }, [chartData])

  if (!chartData.length) {
    return (
      <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-6 shadow-sm">
        <p className="text-sm text-[#1a535c]/75">
          No yearly WQI data available.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-[1.5rem] border border-[#d7eff0] bg-white p-5 shadow-sm">
      <h4 className="text-lg font-semibold text-[#1a535c]">
        Overall WQI trend by year
      </h4>

      <div className="mt-4 h-[280px] md:h-[360px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={1}
          minHeight={1}
        >
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 12, bottom: 10, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#dbeff0" />
            <XAxis dataKey="year" tick={{ fill: "#1a535c", fontSize: 11 }} />
            <YAxis
              tick={{ fill: "#1a535c", fontSize: 11 }}
              domain={yDomain}
              tickFormatter={(v) => Number(v).toFixed(1)}
            />
            <Tooltip
              formatter={(value, _name, item) => {
                const row = item?.payload as { rating?: string } | undefined
                return [`${value}`, `Overall WQI (${row?.rating ?? "Unknown"})`]
              }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #d7eff0",
                backgroundColor: "#ffffff",
              }}
            />
            <Line
              dataKey="score"
              name="Overall WQI"
              stroke="#0284c7"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
