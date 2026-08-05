import { Suspense } from "react"
import { getVolunteering } from "@/services/career"
import { LeadershipVolunteeringSection } from "@/features/career/leadership-volunteering-section"

async function VolunteeringData() {
  const volunteering = await getVolunteering().catch(() => [])

  if (volunteering.length === 0) return null

  return <LeadershipVolunteeringSection leadership={[]} volunteering={volunteering} />
}

export function VolunteeringSection() {
  return (
    <section
      id="volunteering"
      className="relative bg-[#020408] overflow-hidden py-24 border-t border-white/5"
      aria-label="Volunteering"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="h-64 animate-pulse bg-white/5 rounded-2xl" />}>
          <VolunteeringData />
        </Suspense>
      </div>
    </section>
  )
}
