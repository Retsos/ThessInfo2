"use client"

export function DataRow({
  label,
  value,
  badge,
}: {
  label: string
  value: string | null | undefined
  badge?: string
}) {
  return (
    <p className="rounded-xl border border-[#e4f1f1] bg-[#fbfefe] px-3 py-2 text-[#1a535c]">
      <span className="font-medium">{label}:</span> {value ?? "No data"}
      {badge ? ` (${badge})` : ""}
    </p>
  )
}

