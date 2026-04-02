"use client"

import { CircleHelp } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqItems } from "./home-data"

export function FAQSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-[#1daaad]">
          <CircleHelp className="h-5 w-5" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em]">
            Συχνές ερωτήσεις
          </p>
        </div>

        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1a535c] md:text-4xl">
          Χρήσιμες απαντήσεις χωρίς περιττή φλυαρία
        </h2>
      </div>

      <div className="mt-8 rounded-[1.7rem] border border-[#d7eff0] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(241,250,250,0.95))] p-3 shadow-[0_12px_32px_rgba(29,170,173,0.08)]">
        <Accordion defaultValue={["item-0"]} className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`item-${index}`}
              className="rounded-2xl border-b border-[#dceff0] px-4 transition-colors hover:bg-white/70 last:border-b-0"
            >
              <AccordionTrigger className="text-left text-base font-semibold text-[#1a535c] hover:no-underline">
                {item.question}
              </AccordionTrigger>

              <AccordionContent className="text-sm leading-7 text-[#1a535c]/78">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}