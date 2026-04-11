import { Suspense } from "react"
import LeaderboardPageClient from "./page-client"

export default function LeaderboardPage() {
  return (
    <Suspense>
      <LeaderboardPageClient />
    </Suspense>
  )
}
