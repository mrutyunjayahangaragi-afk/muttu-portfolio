"use client"

import { useEffect } from "react"
import { useUIStore } from "@/store"

export function useScrollProgress() {
  const setScrollProgress = useUIStore((s) => s.setScrollProgress)

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [setScrollProgress])
}
