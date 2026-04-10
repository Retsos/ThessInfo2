import { getBandForScore, type QualityBand } from "@/lib/quality-indexes"

/**
 * Safely resolves the colour band for a score.
 * Returns `null` instead of throwing when score is missing or non-numeric.
 */
export function resolveBand(
    score: number | null | undefined,
    legend: QualityBand[]
): ReturnType<typeof getBandForScore> | null {
    if (typeof score !== "number" || !isFinite(score)) return null
    return getBandForScore(score, legend)
}