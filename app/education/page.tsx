import type { Metadata } from "next"
import { getEducation } from "@/services/career"
import { EducationTimeline } from "@/features/career/education-timeline"
import { SectionHero } from "@/features/career/section-hero"
import { EmptyState } from "@/components/ui/empty-state"

export const metadata: Metadata = {
  title: "Education",
  description:
    "My academic background — institutions, degrees, CGPA, coursework, and extracurricular activities.",
  openGraph: {
    title: "Education & Academics",
    description: "Academic background — degrees, institutions, and CGPA.",
  },
}

export const revalidate = 3600

export default async function EducationPage() {
  const education = await getEducation().catch(() => [])

  return (
    <main className="min-h-screen px-4 pb-24 pt-24">
      <div className="mx-auto max-w-5xl">
        <SectionHero
          eyebrow="Academic"
          title="Education"
          description="My academic journey — institutions, degrees, and the knowledge I've gained."
          gradient="from-purple-400 via-violet-400 to-indigo-400"
        />
        {education.length === 0 ? (
          <EmptyState title="Education" message="Content will be available soon." />
        ) : (
          <EducationTimeline items={education} />
        )}
      </div>
    </main>
  )
}
