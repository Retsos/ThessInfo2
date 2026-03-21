"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Droplets, Recycle, Search, Wind, X } from "lucide-react"
import { normalizeText, regionCatalog,  } from "./../../data/region-catalog"

export default function RegionSearch() {
    const router = useRouter()
    const wrapperRef = useRef<HTMLDivElement | null>(null)

    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
    const [warning, setWarning] = useState("")

    const filteredRegions = useMemo(() => {
        const normalizedQuery = normalizeText(query)

        if (!normalizedQuery) {
            return regionCatalog
        }

        return regionCatalog.filter((region) =>
            normalizeText(region.searchValue).includes(normalizedQuery)
        )
    }, [query])

    const selectedRegion = useMemo(() => {
        if (!selectedLabel) return null
        return regionCatalog.find((region) => region.label === selectedLabel) ?? null
    }, [selectedLabel])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    function handleSelect(label: string) {
        setSelectedLabel(label)
        setQuery(label)
        setWarning("")
        setIsOpen(false)
    }

    function handleClear() {
        setQuery("")
        setSelectedLabel(null)
        setWarning("")
        setIsOpen(false)
    }

    function handleSearch() {
        const exactMatch =
            regionCatalog.find(
                (region) => normalizeText(region.label) === normalizeText(query)
            ) ?? null

        const finalRegion = selectedRegion ?? exactMatch

        if (!finalRegion) {
            setWarning("Επίλεξε μία έγκυρη περιοχή από τη λίστα.")
            return
        }

        router.push(`/services/${finalRegion.slug}`)
    }

    return (
        <div className=" rounded-[1.7rem] border border-[#d7eff0] bg-white shadow-[0_22px_55px_rgba(29,170,173,0.12)]">
            <div className="p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="flex-1" ref={wrapperRef}>
                        <label className="mb-2 block text-sm font-semibold text-[#1a535c]">
                            Αναζήτηση Δήμου ή Περιοχής
                        </label>

                        <div className="relative">
                            <div className="flex min-h-14 items-center rounded-2xl border border-[#cfe9ea] bg-[#fbffff] px-4 shadow-sm transition-colors focus-within:border-[#1daaad]">
                                <Search className="mr-3 h-5 w-5 text-[#1daaad]" />

                                <input
                                    value={query}
                                    onChange={(event) => {
                                        setQuery(event.target.value)
                                        setSelectedLabel(null)
                                        setIsOpen(true)
                                        setWarning("")
                                    }}
                                    onFocus={() => setIsOpen(true)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault()
                                            handleSearch()
                                        }
                                    }}
                                    placeholder="Αναζήτηση Δήμου/Περιοχής"
                                    className="w-full bg-transparent text-sm text-[#1a535c] outline-none placeholder:text-[#1a535c]/45"
                                />

                                {query && (
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="ml-2 rounded-full p-1 text-[#1a535c]/55 transition-colors hover:bg-[#eefafa] hover:text-[#006264]"
                                        aria-label="Καθαρισμός"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {isOpen && (
                                <div className="absolute left-0 right-0 top-[calc(100%+0.55rem)] z-[100] max-h-80 overflow-auto rounded-2xl border border-[#d7eff0] bg-white p-2 shadow-[0_18px_45px_rgba(29,170,173,0.14)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#cfe9ea] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#1daaad]">                                    {filteredRegions.length > 0 ? (
                                    filteredRegions.map((region) => (
                                        <button
                                            key={region.label}
                                            type="button"
                                            onClick={() => handleSelect(region.label)}
                                            className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors hover:bg-[#f1fafa]"
                                        >
                                            <span className="text-sm font-medium text-[#1a535c]">
                                                {region.label}
                                            </span>

                                            <span className="ml-3 flex items-center gap-2">
                                                {region.availability.water && (
                                                    <span
                                                        title="Δεδομένα νερού"
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 text-sky-700"
                                                    >
                                                        <Droplets className="h-4 w-4" />
                                                    </span>
                                                )}

                                                {region.availability.recycle && (
                                                    <span
                                                        title="Δεδομένα ανακύκλωσης"
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"
                                                    >
                                                        <Recycle className="h-4 w-4" />
                                                    </span>
                                                )}

                                                {region.availability.air && (
                                                    <span
                                                        title="Δεδομένα αέρα"
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700"
                                                    >
                                                        <Wind className="h-4 w-4" />
                                                    </span>
                                                )}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="rounded-xl px-3 py-4 text-sm text-[#1a535c]/70">
                                        Δεν βρέθηκαν περιοχές για αυτή την αναζήτηση.
                                    </div>
                                )}
                                </div>
                            )}
                        </div>

                        {warning && (
                            <p className="mt-2 text-sm font-medium text-red-600">{warning}</p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleSearch}
                        className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#1daaad] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(29,170,173,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#179ca0]"
                    >
                        Αναζήτηση
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#1a535c]/75">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#eefafa] px-3 py-1.5">
                        <Droplets className="h-3.5 w-3.5 text-sky-700" />
                        Νερό
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#eefaf4] px-3 py-1.5">
                        <Recycle className="h-3.5 w-3.5 text-emerald-700" />
                        Ανακύκλωση
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#eef8fb] px-3 py-1.5">
                        <Wind className="h-3.5 w-3.5 text-cyan-700" />
                        Αέρας
                    </span>
                </div>
            </div>
        </div>
    )
}
