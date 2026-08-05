import { Suspense } from "react"
import { getHackathons } from "@/services/career"
import { FeaturedHackathonsSection } from "@/features/career/featured-hackathons-section"

async function HackathonsData() {
  const hackathons = await getHackathons().catch(() => [])

  if (hackathons.length === 0) return null

  return <FeaturedHackathonsSection hackathons={hackathons} />
}

export function HackathonsSection() {
  return (
    <section
      id="hackathons"
      className="relative bg-[#020408] overflow-hidden py-24 border-t border-white/5"
      aria-label="Hackathons"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="h-64 animate-pulse bg-white/5 rounded-2xl" />}>
          <HackathonsData />
        </Suspense>
      </div>
    </section>
  )
}
