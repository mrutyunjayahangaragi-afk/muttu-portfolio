import { Suspense } from "react"
import { getAchievements } from "@/services/career"
import { AchievementsHighlight } from "@/features/career/achievements-highlight"

async function AchievementsData() {
  const achievements = await getAchievements().catch(() => [])

  if (achievements.length === 0) return null

  return <AchievementsHighlight achievements={achievements} />
}

export function AchievementsSection() {
  return (
    <section
      id="achievements"
      className="relative bg-[#020408] overflow-hidden py-24 border-t border-white/5"
      aria-label="Achievements"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="h-64 animate-pulse bg-white/5 rounded-2xl" />}>
          <AchievementsData />
        </Suspense>
      </div>
    </section>
  )
}
