"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="space-y-6 text-center">
        <p className="text-8xl font-bold text-red-400/60">500</p>
        <h1 className="text-2xl font-semibold text-white">Something went wrong</h1>
        <p className="max-w-sm text-white/50">An unexpected error occurred. Please try again.</p>
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
      </div>
    </main>
  )
}
