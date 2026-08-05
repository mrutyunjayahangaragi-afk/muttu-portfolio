"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  BookOpen,
  Briefcase,
  Award,
  Trophy,
  Star,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Users,
} from "lucide-react"

interface JourneyHeroProps {
  stats: {
    certificates: number
    hackathons: number
    achievements: number
    experience: number
    leadership: number
    yearsLearning: number
  }
}

const NAV_CARDS = [
  {
    href: "/experience",
    icon: Briefcase,
    label: "Experience",
    color: "from-blue-500 to-cyan-500",
    border: "border-blue-500/20",
    glow: "group-hover:shadow-blue-500/20",
  },
  {
    href: "/education",
    icon: GraduationCap,
    label: "Education",
    color: "from-purple-500 to-violet-500",
    border: "border-purple-500/20",
    glow: "group-hover:shadow-purple-500/20",
  },
  {
    href: "/certificates",
    icon: Award,
    label: "Certificates",
    color: "from-emerald-500 to-teal-500",
    border: "border-emerald-500/20",
    glow: "group-hover:shadow-emerald-500/20",
  },
  {
    href: "/hackathons",
    icon: Trophy,
    label: "Hackathons",
    color: "from-rose-500 to-pink-500",
    border: "border-rose-500/20",
    glow: "group-hover:shadow-rose-500/20",
  },
  {
    href: "/achievements",
    icon: Star,
    label: "Achievements",
    color: "from-yellow-500 to-orange-500",
    border: "border-yellow-500/20",
    glow: "group-hover:shadow-yellow-500/20",
  },
  {
    href: "/journey#leadership",
    icon: Users,
    label: "Leadership",
    color: "from-sky-500 to-blue-500",
    border: "border-sky-500/20",
    glow: "group-hover:shadow-sky-500/20",
  },
]

export function JourneyHero({ stats }: JourneyHeroProps) {
  return (
    <section className="aurora relative overflow-hidden px-4 pb-8 pt-32 sm:pt-40">
      {/* Grid background */}
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/4 top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute right-1/4 top-32 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <span className="glass inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-xs text-white/60">
            <Sparkles size={12} className="text-purple-400" />
            Career Journey
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mb-6 text-center text-5xl font-bold leading-tight sm:text-6xl md:text-7xl"
        >
          My{" "}
          <span className="gradient-text">Career</span>
          <br />
          <span className="text-white/80">& Journey</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mx-auto mb-12 max-w-2xl text-center text-lg text-white/50"
        >
          A comprehensive showcase of my education, professional experience,
          certifications, hackathons, and milestones — everything that has shaped me
          as a developer.
        </motion.p>

        {/* Quick Nav Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
        >
          {NAV_CARDS.map((card, i) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
            >
              <Link
                href={card.href}
                className={`group glass glass-hover flex flex-col items-center gap-3 rounded-2xl border ${card.border} p-4 text-center transition-all duration-300 hover:shadow-lg ${card.glow}`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.color}`}
                >
                  <card.icon size={18} className="text-white" />
                </div>
                <span className="text-xs font-medium text-white/70 transition-colors group-hover:text-white">
                  {card.label}
                </span>
                <ArrowRight
                  size={12}
                  className="text-white/20 transition-all group-hover:translate-x-0.5 group-hover:text-white/60"
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
