import type { Metadata } from 'next'
import { Suspense } from "react"
import MapPageClient from "./page-client"

export const metadata: Metadata = {
  title: 'Χάρτης',
}


export default function MapPage() {
  return (
    <Suspense>
      <MapPageClient />
    </Suspense>
  )
}
