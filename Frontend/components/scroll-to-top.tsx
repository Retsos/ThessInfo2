"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Scrolls to the top of the page when the route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    })
  }, [pathname])

  return null
}
