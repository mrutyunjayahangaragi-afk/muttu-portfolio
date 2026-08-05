import { Suspense } from "react"
import { getSkills, getSkillStats } from "@/services/skills"
import { SkillsContent } from "./skills-content"

function SkillsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 animate-pulse">
      <div className="h-8 bg-white/5 rounded-xl w-64 mb-4" />
      <div className="grid grid-cols-6 gap-3 mb-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 bg-white/5 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-48 bg-white/5 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

async function SkillsData() {
  const [skills, stats] = await Promise.all([
    getSkills().catch(() => []),
    getSkillStats().catch(() => ({ total: 0, byCategory: {}, avgProficiency: 0 })),
  ])

  if (skills.length === 0) {
    return null
  }

  return <SkillsContent skills={skills} stats={stats} />
}

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="relative bg-[#020408] overflow-hidden py-24"
      aria-label="Skills and technologies"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 left-1/4 w-[700px] h-[500px] rounded-full opacity-[0.07] blur-[120px]"
          style={{ background: "radial-gradient(ellipse, #3b82f6, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[600px] h-[500px] rounded-full opacity-[0.07] blur-[120px]"
          style={{ background: "radial-gradient(ellipse, #a855f7, transparent 70%)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-3">
            Technical Expertise
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Skills &amp;{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Technologies
            </span>
          </h2>
          <p className="text-white/55 max-w-xl mx-auto text-base">
            A curated collection of technologies I&apos;ve mastered and continue to explore.
          </p>
        </div>

        <Suspense fallback={<SkillsSkeleton />}>
          <SkillsData />
        </Suspense>
      </div>
    </section>
  )
}
