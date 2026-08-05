import { Suspense } from "react"
import { getLeadership } from "@/services/career"
import { LeadershipVolunteeringSection } from "@/features/career/leadership-volunteering-section"

async function LeadershipData() {
  const leadership = await getLeadership().catch(() => [])

  if (leadership.length === 0) return null

  return <LeadershipVolunteeringSection leadership={leadership} volunteering={[]} />
}

export function LeadershipSection() {
  return (
    <section
      id="leadership"
      className="relative bg-[#020408] overflow-hidden py-24 border-t border-white/5"
      aria-label="Leadership"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="h-64 animate-pulse bg-white/5 rounded-2xl" />}>
          <LeadershipData />
        </Suspense>
      </div>
    </section>
  )
}
