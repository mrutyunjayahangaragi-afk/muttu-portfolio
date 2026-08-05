import { Suspense } from "react"
import { getExperience } from "@/services/career"
import { ExperienceTimeline } from "@/features/career/experience-timeline"

async function ExperienceData() {
  const experience = await getExperience().catch(() => [])

  if (experience.length === 0) return null

  return <ExperienceTimeline items={experience} />
}

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative bg-[#020408] overflow-hidden py-24 border-t border-white/5"
      aria-label="Work Experience"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-3">Career</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Work{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className="text-white/55 mt-3 max-w-lg mx-auto text-base">
            Roles, companies, tech stacks, and responsibilities across my professional journey.
          </p>
        </div>

        <Suspense fallback={<div className="h-64 animate-pulse bg-white/5 rounded-2xl" />}>
          <ExperienceData />
        </Suspense>
      </div>
    </section>
  )
}
