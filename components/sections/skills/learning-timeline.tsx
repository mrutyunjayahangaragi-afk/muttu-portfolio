"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import type { Skill } from "@/types"

const CATEGORY_COLORS: Record<string, string> = {
  frontend:  "from-blue-500 to-cyan-500",
  backend:   "from-green-500 to-emerald-500",
  ai_ml:     "from-purple-500 to-pink-500",
  database:  "from-orange-500 to-amber-500",
  devops:    "from-red-500 to-orange-500",
  cloud:     "from-sky-500 to-blue-500",
  tools:     "from-teal-500 to-cyan-500",
  languages: "from-pink-500 to-rose-500",
  other:     "from-gray-500 to-slate-500",
}

interface TimelineItemProps {
  skill: Skill
  index: number
  isLeft: boolean
  isLast: boolean
}

function TimelineItem({ skill, index, isLeft, isLast }: TimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  const color = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.other
  const learnedYear = new Date().getFullYear() - Math.floor(skill.years_of_experience)

  return (
    <div ref={ref} className="relative grid grid-cols-[1fr_40px_1fr] gap-0 md:gap-4 items-start">
      {/* Left side */}
      <div className={`py-2 ${isLeft ? "" : "opacity-0 pointer-events-none"}`}>
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="glass rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-colors text-right"
          >
            <div className="flex items-center justify-end gap-2 mb-1">
              <span className="text-sm font-semibold text-white">{skill.name}</span>
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-xs font-bold text-white`}>
                {skill.icon ?? skill.name[0]}
              </div>
            </div>
            <p className="text-xs text-white/45 capitalize">{skill.category.replace("_", " / ")}</p>
            <p className="text-xs text-white/35 mt-0.5">{skill.proficiency}% proficiency</p>
          </motion.div>
        )}
      </div>

      {/* Center spine + dot */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: index * 0.06 }}
          className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-xs font-bold text-white z-10 shrink-0 shadow-lg`}
        >
          {learnedYear.toString().slice(-2)}
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.06 + 0.15 }}
            className="flex-1 w-px bg-gradient-to-b from-white/20 to-transparent origin-top mt-1"
            style={{ minHeight: 32 }}
          />
        )}
      </div>

      {/* Right side */}
      <div className={`py-2 ${!isLeft ? "" : "opacity-0 pointer-events-none"}`}>
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="glass rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-xs font-bold text-white`}>
                {skill.icon ?? skill.name[0]}
              </div>
              <span className="text-sm font-semibold text-white">{skill.name}</span>
            </div>
            <p className="text-xs text-white/45 capitalize">{skill.category.replace("_", " / ")}</p>
            <p className="text-xs text-white/35 mt-0.5">{skill.proficiency}% proficiency</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

interface LearningTimelineProps {
  skills: Skill[]
}

export function LearningTimeline({ skills }: LearningTimelineProps) {
  // Sort by years_of_experience desc to get oldest first
  const sorted = [...skills].sort((a, b) => b.years_of_experience - a.years_of_experience)

  if (!sorted.length) return null

  return (
    <div className="mb-16">
      <div className="text-center mb-10">
        <p className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-1">The Journey</p>
        <h3 className="text-2xl font-bold text-white">Learning Timeline</h3>
        <p className="text-sm text-white/45 mt-1">Technologies learned over time</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-0">
        {sorted.map((skill, i) => (
          <TimelineItem
            key={skill.id}
            skill={skill}
            index={i}
            isLeft={i % 2 === 0}
            isLast={i === sorted.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
