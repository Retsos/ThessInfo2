import type { Metadata } from 'next'
import MapPageClient from "./page-client"

export const metadata: Metadata = {
  title: 'Χάρτης',
}


export default function MapPage() {
  return <MapPageClient />
}

