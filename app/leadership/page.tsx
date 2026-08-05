import type { Metadata } from "next"
import { getLeadership } from "@/services/career"
import { SectionHero } from "@/features/career/section-hero"
import { LeadershipVolunteeringSection } from "@/features/career/leadership-volunteering-section"
import { EmptyState } from "@/components/ui/empty-state"

export const metadata: Metadata = {
  title: "Leadership",
  description: "Explore my leadership experience, organization roles, team guidance, and key initiatives.",
  openGraph: {
    title: "Leadership Roles & Experience",
    description: "Guiding engineering teams, leading tech communities, and organizing initiatives.",
  },
}

export const revalidate = 3600

export default async function LeadershipPage() {
  const leadership = await getLeadership().catch(() => [])

  return (
    <main className="min-h-screen px-4 pb-24 pt-24">
      <div className="mx-auto max-w-6xl">
        <SectionHero
          eyebrow="Responsibility"
          title="Leadership"
          description="Guiding teams, mentoring developers, and managing technological initiatives."
          gradient="from-blue-400 via-indigo-400 to-purple-400"
        />
        {leadership.length === 0 ? (
          <EmptyState title="Leadership" message="Content will be available soon." />
        ) : (
          <LeadershipVolunteeringSection leadership={leadership} volunteering={[]} />
        )}
      </div>
    </main>
  )
}
