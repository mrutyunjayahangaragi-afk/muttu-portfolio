import type { Metadata } from "next"
import { getExperience } from "@/services/career"
import { ExperienceTimeline } from "@/features/career/experience-timeline"
import { SectionHero } from "@/features/career/section-hero"

export const metadata: Metadata = {
  title: "Experience",
  description:
    "My professional work experience — roles, companies, responsibilities, and technologies I have worked with.",
  openGraph: {
    title: "Work Experience",
    description: "Professional experience timeline — roles, companies, and tech stacks.",
  },
}

export const revalidate = 3600

export default async function ExperiencePage() {
  const experience = await getExperience().catch(() => [])

  return (
    <main className="min-h-screen px-4 pb-24 pt-24">
      <div className="mx-auto max-w-5xl">
        <SectionHero
          eyebrow="Career"
          title="Work Experience"
          description="My professional journey across companies, roles, and technologies."
          gradient="from-blue-400 via-cyan-400 to-teal-400"
        />
        <ExperienceTimeline items={experience} />
      </div>
    </main>
  )
}
