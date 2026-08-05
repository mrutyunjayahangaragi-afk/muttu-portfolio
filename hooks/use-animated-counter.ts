"use client"

import { useEffect, useState, useRef } from "react"

/**
 * Animates a numeric value from 0 to the target when the element enters the viewport.
 * Handles values like "50+", "3+" by stripping the suffix and re-appending it.
 */
export function useAnimatedCounter(
  rawValue: string,
  duration = 1500
): string {
  const [display, setDisplay] = useState("0")
  const ref = useRef<HTMLSpanElement | null>(null)
  const observed = useRef(false)

  // Parse: "50+" → { num: 50, suffix: "+" }
  const match = rawValue.match(/^([\d,]+)(\D*)$/)
  const numStr = match?.[1]?.replace(/,/g, "") ?? ""
  const suffix = match?.[2] ?? ""
  const target = parseInt(numStr, 10)
  const isNumeric = !isNaN(target) && numStr !== ""

  useEffect(() => {
    if (!isNumeric) {
      setDisplay(rawValue)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !observed.current) {
          observed.current = true
          const start = performance.now()
          function step(now: number) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = Math.floor(eased * target)
            setDisplay(
              current.toLocaleString() + (progress < 1 ? "" : suffix)
            )
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [isNumeric, target, suffix, duration, rawValue])

  return isNumeric ? display + (observed.current ? "" : "") : rawValue
}

export { useAnimatedCounter as default }
