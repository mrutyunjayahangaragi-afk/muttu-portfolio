import type { Metadata } from "next"
import { getVolunteering } from "@/services/career"
import { SectionHero } from "@/features/career/section-hero"
import { LeadershipVolunteeringSection } from "@/features/career/leadership-volunteering-section"
import { EmptyState } from "@/components/ui/empty-state"

export const metadata: Metadata = {
  title: "Volunteering",
  description: "My community involvement, social initiatives, tech mentoring, and volunteering contributions.",
  openGraph: {
    title: "Volunteering & Community Impact",
    description: "Giving back through tech workshops, community mentoring, and open initiatives.",
  },
}

export const revalidate = 3600

export default async function VolunteeringPage() {
  const volunteering = await getVolunteering().catch(() => [])

  return (
    <main className="min-h-screen px-4 pb-24 pt-24">
      <div className="mx-auto max-w-6xl">
        <SectionHero
          eyebrow="Community"
          title="Volunteering"
          description="Giving back through open source, developer mentoring, and community initiatives."
          gradient="from-pink-400 via-rose-400 to-red-400"
        />
        {volunteering.length === 0 ? (
          <EmptyState title="Volunteering" message="Content will be available soon." />
        ) : (
          <LeadershipVolunteeringSection leadership={[]} volunteering={volunteering} />
        )}
      </div>
    </main>
  )
}
