import type { Metadata } from "next"
import { Suspense } from "react"
import {
  getExperience,
  getEducation,
  getFeaturedAchievements,
  getFeaturedCertificates,
  getFeaturedHackathons,
  getLeadership,
  getVolunteering,
  getCareerStats,
} from "@/services/career"
import { getJourneyMilestones } from "@/services/about"
import { JourneyHero } from "@/features/career/journey-hero"
import { CareerStats } from "@/features/career/career-stats"
import { JourneyTimeline } from "@/features/career/journey-timeline"
import { FeaturedCertificatesSection } from "@/features/career/featured-certificates-section"
import { FeaturedHackathonsSection } from "@/features/career/featured-hackathons-section"
import { AchievementsHighlight } from "@/features/career/achievements-highlight"
import { LeadershipVolunteeringSection } from "@/features/career/leadership-volunteering-section"
import { StatsSkeleton } from "@/features/career/skeletons"

export const metadata: Metadata = {
  title: "Career Journey",
  description:
    "Explore my professional journey — education, experience, certifications, hackathons, and achievements that shaped who I am as a developer.",
  openGraph: {
    title: "Career Journey",
    description:
      "My education, work experience, certificates, hackathons and achievements.",
    type: "profile",
  },
}

export const revalidate = 3600

export default async function JourneyPage() {
  const [
    experience,
    education,
    milestones,
    achievements,
    certificates,
    hackathons,
    leadership,
    volunteering,
    stats,
  ] = await Promise.all([
    getExperience().catch(() => []),
    getEducation().catch(() => []),
    getJourneyMilestones().catch(() => []),
    getFeaturedAchievements().catch(() => []),
    getFeaturedCertificates().catch(() => []),
    getFeaturedHackathons().catch(() => []),
    getLeadership().catch(() => []),
    getVolunteering().catch(() => []),
    getCareerStats().catch(() => ({
      certificates: 0,
      hackathons: 0,
      achievements: 0,
      experience: 0,
      leadership: 0,
      yearsLearning: 0,
    })),
  ])

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <JourneyHero stats={stats} />

      {/* Animated Career Stats */}
      <Suspense fallback={<StatsSkeleton />}>
        <CareerStats stats={stats} />
      </Suspense>

      {/* Experience + Education + Milestones Combined Timeline */}
      <JourneyTimeline experience={experience} education={education} milestones={milestones} />

      {/* Featured Certificates */}
      {certificates.length > 0 && (
        <FeaturedCertificatesSection certificates={certificates} />
      )}

      {/* Featured Hackathons */}
      {hackathons.length > 0 && (
        <FeaturedHackathonsSection hackathons={hackathons} />
      )}

      {/* Achievements Highlight */}
      {achievements.length > 0 && (
        <AchievementsHighlight achievements={achievements} />
      )}

      {/* Leadership & Volunteering */}
      {(leadership.length > 0 || volunteering.length > 0) && (
        <LeadershipVolunteeringSection
          leadership={leadership}
          volunteering={volunteering}
        />
      )}
    </main>
  )
}
