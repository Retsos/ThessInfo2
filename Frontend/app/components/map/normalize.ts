/**
 * Strips diacritics, lowercases, and removes noise tokens
 * so that Greek/Latin GeoJSON names can be compared against backend area names.
 */
export function normalizeText(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\bmunicipality\b/g, "")
        .replace(/\bdimos\b/g, "")
        .replace(/\s+/g, " ")
        .trim()
}
