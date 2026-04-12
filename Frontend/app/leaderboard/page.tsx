import type { Metadata } from 'next'
import { Suspense } from "react"
import LeaderboardPageClient from "./page-client"

export const metadata: Metadata = {
  title: 'Κατάταξη',
}


export default function LeaderboardPage() {
  return (
    <Suspense>
      <LeaderboardPageClient />
    </Suspense>
  )
}
