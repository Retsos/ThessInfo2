import type { Metadata } from 'next'
import { LearnMoreCTA } from "./../components/learn-more/learn-more-cta"

export const metadata: Metadata = {
  title: 'Μάθε περισσότερα',
}

import { LearnMoreFAQ } from "./../components/learn-more/learn-more-faq"
import { LearnMoreHero } from "./../components/learn-more/learn-more-hero"
import { LearnMoreHighlights } from "./../components/learn-more/learn-more-highlights"

export default function LearnMorePage() {
    return (
        <div className="overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#f7fdfd_38%,#ffffff_100%)]">
            <LearnMoreHero />
            <LearnMoreHighlights />
            <LearnMoreFAQ />
            <LearnMoreCTA />
        </div>
    )
}