import type { Metadata } from "next"
import { getHackathons } from "@/services/career"
import { HackathonsGrid } from "@/features/career/hackathons-grid"
import { SectionHero } from "@/features/career/section-hero"
import { EmptyState } from "@/components/ui/empty-state"

export const metadata: Metadata = {
  title: "Hackathons",
  description:
    "Hackathons I have participated in — problem statements, solutions, tech stacks, team info, prizes, and project demos.",
  openGraph: {
    title: "Hackathons",
    description: "Hackathon participations with solutions, tech stacks, and prizes.",
  },
}

export const revalidate = 3600

export default async function HackathonsPage() {
  const hackathons = await getHackathons().catch(() => [])

  return (
    <main className="min-h-screen px-4 pb-24 pt-24">
      <div className="mx-auto max-w-7xl">
        <SectionHero
          eyebrow="Competitions"
          title="Hackathons"
          description="Problem statements tackled, solutions built, and lessons learned across hackathons and competitions."
          gradient="from-rose-400 via-pink-400 to-purple-400"
        />
        {hackathons.length === 0 ? (
          <EmptyState title="Hackathons" message="Content will be available soon." />
        ) : (
          <HackathonsGrid hackathons={hackathons} />
        )}
      </div>
    </main>
  )
}
