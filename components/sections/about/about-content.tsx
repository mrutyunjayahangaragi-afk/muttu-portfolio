"use client"

import { motion } from "framer-motion"
import type { AboutProfile, AboutStat, JourneyMilestone, CoreValue, FunFact } from "@/types/about"
import type { Education } from "@/types"
import { ProfileCard } from "./profile-card"
import { AboutStats } from "./about-stats"
import { EducationTimeline } from "./education-timeline"
import { JourneyTimeline } from "./journey-timeline"
import { PersonalInfoCards } from "./personal-info-cards"
import { CoreValues } from "./core-values"
import { FunFacts } from "./fun-facts"

interface AboutContentProps {
  profile: AboutProfile | null
  stats: AboutStat[]
  milestones: JourneyMilestone[]
  education: Education[]
  coreValues: CoreValue[]
  funFacts: FunFact[]
}

export function AboutContent({
  profile,
  stats,
  milestones,
  education,
  coreValues,
  funFacts,
}: AboutContentProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* ── Hero Row: Profile + Bio ───────────────────────────────────────── */}
      <div className="py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — profile card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex justify-center"
        >
          <ProfileCard profile={profile} />
        </motion.div>

        {/* Right — bio + stats */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="space-y-8"
        >
          {/* Section label */}
          <div>
            <p className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-2">
              Get to know me
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              About{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Me
              </span>
            </h2>
          </div>

          {/* Bio — only shown when admin has filled it in */}
          {profile?.bio ? (
            <div className="space-y-4 text-white/70 leading-relaxed">
              {profile.bio.split("\n\n").map((para, i) => (
                <p key={i} className="text-base">{para}</p>
              ))}
            </div>
          ) : (
            <div className="glass rounded-xl p-5 border border-white/10 text-center">
              <p className="text-white/40 text-sm">Bio not added yet.</p>
              <p className="text-white/25 text-xs mt-1">Add your bio through the admin dashboard.</p>
            </div>
          )}

          {/* Stats grid */}
          <AboutStats stats={stats} />
        </motion.div>
      </div>

      {/* ── Personal Info Cards ───────────────────────────────────────────── */}
      <div className="pb-24">
        <SectionHeader
          tag="The Details"
          tagColor="text-cyan-400"
          title="Personal Info"
          delay={0}
        />
        <PersonalInfoCards profile={profile} />
      </div>

      {/* ── Education Timeline ────────────────────────────────────────────── */}
      <div className="pb-24">
        <EducationTimeline education={education} />
      </div>

      {/* ── Journey Timeline ──────────────────────────────────────────────── */}
      <div className="pb-24">
        <JourneyTimeline milestones={milestones} />
      </div>

      {/* ── Core Values ───────────────────────────────────────────────────── */}
      <div className="pb-24">
        <CoreValues values={coreValues} />
      </div>

      {/* ── Skills Preview — rendered by the About Section server component ── */}
      {/* NOTE: SkillsPreview is a Server Component fetched separately in index.tsx */}

      {/* ── Fun Facts ─────────────────────────────────────────────────────── */}
      <div className="pb-24">
        <FunFacts facts={funFacts} />
      </div>
    </div>
  )
}

// ─── Shared section header ────────────────────────────────────────────────────

function SectionHeader({
  tag,
  tagColor,
  title,
  subtitle,
  delay = 0,
}: {
  tag: string
  tagColor: string
  title: string
  subtitle?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="mb-8"
    >
      <p className={`text-xs font-mono ${tagColor} uppercase tracking-widest mb-1`}>{tag}</p>
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      {subtitle && <p className="text-white/50 text-sm mt-1">{subtitle}</p>}
    </motion.div>
  )
}
