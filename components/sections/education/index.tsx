import { Suspense } from "react"
import { getEducation } from "@/services/career"
import { EducationTimeline } from "@/features/career/education-timeline"

async function EducationData() {
  const education = await getEducation().catch(() => [])

  if (education.length === 0) return null

  return <EducationTimeline items={education} />
}

export function EducationSection() {
  return (
    <section
      id="education"
      className="relative bg-[#020408] overflow-hidden py-24 border-t border-white/5"
      aria-label="Education"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-3">Academic</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Education &amp;{" "}
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Background
            </span>
          </h2>
          <p className="text-white/55 mt-3 max-w-lg mx-auto text-base">
            Academic degrees, institutions, coursework, and key milestones.
          </p>
        </div>

        <Suspense fallback={<div className="h-64 animate-pulse bg-white/5 rounded-2xl" />}>
          <EducationData />
        </Suspense>
      </div>
    </section>
  )
}
