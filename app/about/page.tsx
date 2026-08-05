import type { Metadata } from "next"
import { getAboutData } from "@/services/about"
import { AboutContent } from "@/components/sections/about/about-content"
import { EmptyState } from "@/components/ui/empty-state"

export const metadata: Metadata = {
  title: "About Me",
  description:
    "Learn more about my background, career journey, core engineering values, and personal milestones.",
  openGraph: {
    title: "About Me | Developer Portfolio",
    description: "My background, software engineering journey, core values, and milestones.",
  },
}

export const revalidate = 3600

export default async function AboutPage() {
  const { profile, stats, milestones, education, coreValues, funFacts } =
    await getAboutData().catch(() => ({
      profile: null,
      stats: [],
      milestones: [],
      education: [],
      coreValues: [],
      funFacts: [],
    }))

  const hasData = Boolean(profile || stats.length > 0 || milestones.length > 0 || coreValues.length > 0)

  if (!hasData) {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <EmptyState title="About Section" message="Content will be available soon." />
      </main>
    )
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.name || "Developer",
    jobTitle: profile?.tagline || "Software Engineer",
    description: profile?.bio || "Full Stack & AI Developer",
    knowsAbout: profile?.interests || [],
  }

  return (
    <main className="min-h-screen bg-[#020408] pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-blue-400">Biography</p>
          <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">
            About{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Me
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/60">
            {profile?.tagline || "Engineering high-performance applications with modern tools and clean architecture."}
          </p>
        </div>

        <AboutContent
          profile={profile}
          stats={stats}
          milestones={milestones}
          education={education}
          coreValues={coreValues}
          funFacts={funFacts}
        />
      </div>
    </main>
  )
}
