"use client"

import { X } from "lucide-react"

export function InfoModal({
  open,
  title,
  body,
  onClose,
}: {
  open: boolean
  title: string
  body: string
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#d7eff0] bg-white p-5 shadow-xl md:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[#1a535c]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#d7eff0] p-1.5 text-[#1a535c]/80 hover:bg-[#f4fbfb]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-sm leading-7 text-[#1a535c]/80">{body}</p>
      </div>
    </div>
  )
}

