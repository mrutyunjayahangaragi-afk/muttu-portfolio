"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Download, Briefcase } from "lucide-react"
import { TypewriterText } from "./typewriter-text"
import { MagneticButton } from "./magnetic-button"
import { SocialLinks } from "./social-links"
import { HeroStatCard } from "./hero-stat-card"
import { TextReveal } from "@/components/animations/text-reveal"
import { Badge } from "@/components/ui/badge"
import { HireMeModal } from "@/components/modals/hire-me-modal"
import { durations } from "@/lib/design-tokens"
import type { HeroProfile, HeroStat } from "@/types/hero"

interface HeroLeftProps {
  profile: HeroProfile | null
  stats: HeroStat[]
}

export function HeroLeft({ profile, stats }: HeroLeftProps) {
  const [isHireMeOpen, setIsHireMeOpen] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24, filter: "blur(5px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: durations.slow,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  }

  const hasName        = profile?.name && profile.name.trim() !== ""
  const hasRoles       = (profile?.roles?.length ?? 0) > 0
  const hasTagline     = profile?.tagline && profile.tagline.trim() !== ""
  const hasAvailText   = profile?.availability_text && profile.availability_text.trim() !== ""
  const hasResume      = !!profile?.resume_url

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col gap-6 pt-8 pb-16 lg:py-0"
      >
        {/* Availability badge */}
        {hasAvailText && (
          <motion.div variants={itemVariants}>
            <Badge 
              variant="blue" 
              pulse 
              size="lg" 
              className="gradient-border-animated py-1.5 px-4 tracking-widest uppercase text-[10px] font-semibold"
            >
              {profile!.availability_text}
            </Badge>
          </motion.div>
        )}

        {/* Name block */}
        {hasName && (
          <motion.div variants={itemVariants} className="space-y-3">
            <p className="text-lg font-light text-white/50 tracking-wider">
              {profile!.greeting}
            </p>
            <TextReveal 
              text={profile!.name} 
              as="h1" 
              className="text-5xl leading-none font-extrabold tracking-tight md:text-6xl xl:text-7xl bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent"
            />
          </motion.div>
        )}

        {/* Typewriter roles */}
        {hasRoles && (
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-white/40 tracking-wider">I am a</span>
            <TypewriterText
              texts={profile!.roles}
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-xl font-bold text-transparent md:text-2xl"
            />
          </motion.div>
        )}

        {/* Tagline */}
        {hasTagline && (
          <motion.p
            variants={itemVariants}
            className="max-w-lg text-base leading-relaxed text-white/60 text-pretty"
          >
            {profile!.tagline}
          </motion.p>
        )}

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
          <MagneticButton variant="primary" href="#projects" className="text-sm">
            <ArrowRight size={16} />
            View Projects
          </MagneticButton>

          {hasResume && (
            <MagneticButton
              variant="secondary"
              href={profile!.resume_url!}
              className="text-sm"
            >
              <Download size={16} />
              Download Resume
            </MagneticButton>
          )}

          <button
            type="button"
            onClick={() => setIsHireMeOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-blue-500/30 bg-blue-500/10 text-white font-medium hover:bg-blue-500/20 hover:border-blue-500/50 transition-all text-sm shadow-lg shadow-blue-500/10"
          >
            <Briefcase size={16} className="text-blue-400" />
            Hire Me
          </button>
        </motion.div>

        {/* Social Links */}
        <motion.div variants={itemVariants} className="pt-2">
          <SocialLinks profile={profile} />
        </motion.div>

        {/* Stats Grid with dynamic Counter integration */}
        {stats.length > 0 && (
          <motion.div variants={itemVariants} className="grid max-w-lg grid-cols-3 gap-4 pt-4 border-t border-white/5">
            {stats.map((stat) => (
              <HeroStatCard key={stat.id} stat={stat} />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Hire Me Glassmorphism Modal */}
      <HireMeModal isOpen={isHireMeOpen} onClose={() => setIsHireMeOpen(false)} />
    </>
  )
}
