"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { trackPageViewAction } from "@/features/analytics/analytics-actions"

export function AnalyticsTracker() {
  const pathname = usePathname()
  const lastTracked = useRef<string | null>(null)

  useEffect(() => {
    // Only track public paths, skip admin routes to preserve visitor accuracy
    if (pathname && !pathname.startsWith("/admin") && lastTracked.current !== pathname) {
      lastTracked.current = pathname
      trackPageViewAction(pathname)
    }
  }, [pathname])

  return null
}
