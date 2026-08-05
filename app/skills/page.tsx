import type { Metadata } from "next"
import { getSkills, getSkillStats } from "@/services/skills"
import { SkillsContent } from "@/components/sections/skills/skills-content"
import { EmptyState } from "@/components/ui/empty-state"

export const metadata: Metadata = {
  title: "Skills & Expertise",
  description:
    "Explore my technical stack, programming languages, frameworks, cloud tools, and proficiency metrics.",
  openGraph: {
    title: "Skills & Tech Stack",
    description: "Frontend, Backend, AI/ML, DevOps, and Database expertise.",
  },
}

export const revalidate = 3600

export default async function SkillsPage() {
  const [skills, stats] = await Promise.all([
    getSkills().catch(() => []),
    getSkillStats().catch(() => ({ total: 0, byCategory: {}, avgProficiency: 0 })),
  ])

  if (skills.length === 0) {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <EmptyState title="Skills" message="Content will be available soon." />
      </main>
    )
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Technical Skills & Technologies",
    numberOfItems: skills.length,
    itemListElement: skills.map((skill, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: skill.name,
    })),
  }

  return (
    <main className="min-h-screen bg-[#020408] pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-blue-400">Technical Stack</p>
          <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">
            Skills &amp;{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Expertise
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/60">
            Technologies, frameworks, and engineering competencies I leverage to build robust software.
          </p>
        </div>

        <SkillsContent skills={skills} stats={stats} />
      </div>
    </main>
  )
}
