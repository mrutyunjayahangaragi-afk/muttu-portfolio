import type { Metadata } from "next"
import { getAchievements } from "@/services/career"
import { AchievementsGrid } from "@/features/career/achievements-grid"
import { SectionHero } from "@/features/career/section-hero"
import { EmptyState } from "@/components/ui/empty-state"

export const metadata: Metadata = {
  title: "Achievements",
  description:
    "Awards, rankings, scholarships, publications, and milestones from my career in software engineering.",
  openGraph: {
    title: "Achievements & Awards",
    description: "Awards, rankings, scholarships, and key milestones.",
  },
}

export const revalidate = 3600

export default async function AchievementsPage() {
  const achievements = await getAchievements().catch(() => [])

  return (
    <main className="min-h-screen px-4 pb-24 pt-24">
      <div className="mx-auto max-w-6xl">
        <SectionHero
          eyebrow="Milestones"
          title="Achievements"
          description="Awards, rankings, scholarships, and milestones that mark my journey as a developer."
          gradient="from-yellow-400 via-orange-400 to-red-400"
        />
        {achievements.length === 0 ? (
          <EmptyState title="Achievements" message="Content will be available soon." />
        ) : (
          <AchievementsGrid achievements={achievements} />
        )}
      </div>
    </main>
  )
}
