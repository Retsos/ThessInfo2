import { Droplets, MapPinned, Recycle, Wind } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { AQI_BANDS, EQI_BANDS, WQI_BANDS, type QualityBand } from "@/lib/quality-indexes"
import type { MetricConfig, MetricKey, MetricModalContent } from "./map-types"

const RECYCLE_BANDS: QualityBand[] = [
  {
    min: 5,
    max: 100,
    label: ">5.0 Εξαιρετική",
    color: "#15803d",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-800",
    borderClass: "border-emerald-200",
  },
  {
    min: 4,
    max: 4.99,
    label: "4.0-5.0 Καλή",
    color: "#22c55e",
    bgClass: "bg-green-50",
    textClass: "text-green-800",
    borderClass: "border-green-200",
  },
  {
    min: 3,
    max: 3.99,
    label: "3.0-4.0 Μέτρια",
    color: "#f59e0b",
    bgClass: "bg-amber-50",
    textClass: "text-amber-800",
    borderClass: "border-amber-200",
  },
  {
    min: 0,
    max: 2.99,
    label: "<3.0 Χαμηλή",
    color: "#ef4444",
    bgClass: "bg-rose-50",
    textClass: "text-rose-800",
    borderClass: "border-rose-200",
  },
]

export const metricOptions: Array<{ key: MetricKey; label: string; icon: LucideIcon; color: string }> = [
  { key: "overall", label: "Συνολική Ποιότητα", icon: MapPinned, color: "text-[#1a535c]" },
  { key: "air", label: "Αέρας", icon: Wind, color: "text-sky-700" },
  { key: "water", label: "Νερό", icon: Droplets, color: "text-cyan-700" },
  { key: "recycle", label: "Ανακύκλωση", icon: Recycle, color: "text-emerald-700" },
]

export const metricConfigs: Record<MetricKey, MetricConfig> = {
  overall: {
    title: "Συνολική περιβαλλοντική εικόνα",
    hint: "Πραγματικό EQI_display από backend shared endpoint, με βάση τον τελευταίο διαθέσιμο μήνα ανά περιοχή.",
    buttonLabel: "Συνολική Ποιότητα",
    indexCode: "EQI",
    color: "text-[#1a535c]",
    colorSoft: "bg-[#e9fbfb]",
    legend: EQI_BANDS,
  },
  air: {
    title: "Ποιότητα αέρα ανά περιοχή",
    hint: "Πραγματικό AQI από τον τελευταίο διαθέσιμο μήνα ανά περιοχή.",
    buttonLabel: "Αέρας",
    indexCode: "AQI",
    color: "text-sky-700",
    colorSoft: "bg-sky-50",
    legend: AQI_BANDS,
  },
  water: {
    title: "Ποιότητα νερού ανά περιοχή",
    hint: "Πραγματικό WQI από τον τελευταίο διαθέσιμο μήνα ανά περιοχή.",
    buttonLabel: "Νερό",
    indexCode: "WQI",
    color: "text-cyan-700",
    colorSoft: "bg-cyan-50",
    legend: WQI_BANDS,
  },
  recycle: {
    title: "Απόδοση ανακύκλωσης ανά περιοχή",
    hint: "Ανακυκλώσιμα κιλά ανά κάτοικο από τον τελευταίο διαθέσιμο μήνα.",
    buttonLabel: "Ανακύκλωση",
    indexCode: "kg/κάτ.",
    color: "text-emerald-700",
    colorSoft: "bg-emerald-50",
    legend: RECYCLE_BANDS,
  },
}

export const metricModalContent: Record<MetricKey, MetricModalContent> = {
  overall: {
    button: "Τι είναι το συνολικό QI;",
    title: "Επεξήγηση Συνολικού QI (EQI)",
    placeholder:
      "Placeholder modal για EQI. Εδώ θα μπει το τελικό κείμενο για normalize αέρα/νερό, βάρη και EQI_display.",
  },
  air: {
    button: "Πώς υπολογίζεται το AQI;",
    title: "Επεξήγηση Air Quality Index (AQI)",
    placeholder:
      "Placeholder modal για AQI. Εδώ θα μπει το τελικό κείμενο με τη λογική που χρησιμοποιείται στα results.",
  },
  water: {
    button: "Πώς υπολογίζεται το WQI;",
    title: "Επεξήγηση Water Quality Index (WQI)",
    placeholder:
      "Placeholder modal για WQI. Εδώ θα μπει το τελικό κείμενο με τη λογική που χρησιμοποιείται στα results.",
  },
  recycle: {
    button: "Πώς μετριέται η ανακύκλωση;",
    title: "Δείκτες Ανακύκλωσης (kg/κάτοικο & Efficiency)",
    placeholder:
      "Η επίδοση της ανακύκλωσης αξιολογείται με δύο βασικούς δείκτες:\n\n1. Κιλά ανά κάτοικο (kg/κάτ.)\nΔείχνει πόσα κιλά ανακυκλώσιμων συλλέγονται ανά άτομο.\nΌσο μεγαλύτερη η τιμή, τόσο μεγαλύτερη η συμμετοχή των πολιτών.\n\n2. Απόδοση διαλογής (Efficiency %)\nΔείχνει την ποιότητα της ανακύκλωσης.\nΥπολογίζεται ως:\n\nΚαθαρά Ανακυκλώσιμα / (Καθαρά Ανακυκλώσιμα + Υπόλειμμα)\n\nΤο υπόλειμμα είναι τα κοινά απορρίμματα που καταλήγουν λανθασμένα στον μπλε κάδο και τελικά οδηγούνται σε ταφή.\n\n👉 Υψηλή απόδοση σημαίνει σωστή διαλογή στην πηγή.\n👉 Χαμηλή απόδοση σημαίνει ότι μεγάλο μέρος του περιεχομένου απορρίπτεται.\n\nΟ δείκτης υπολογίζεται στο Κέντρο Διαλογής (ΚΔΑΥ), με επιθυμητό στόχο περίπου 70%.",
  },
}
