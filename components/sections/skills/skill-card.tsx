"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, BookOpen, CheckCircle, Zap } from "lucide-react"
import { CircularProgress } from "./circular-progress"
import type { Skill } from "@/types"
import { cn } from "@/lib/utils"

const CATEGORY_COLORS: Record<string, string> = {
  frontend:  "from-blue-500 to-cyan-500",
  backend:   "from-green-500 to-emerald-500",
  ai_ml:     "from-purple-500 to-pink-500",
  database:  "from-orange-500 to-amber-500",
  devops:    "from-red-500 to-orange-500",
  cloud:     "from-sky-500 to-blue-500",
  tools:     "from-teal-500 to-cyan-500",
  languages: "from-pink-500 to-rose-500",
  frameworks:"from-indigo-500 to-blue-500",
  other:     "from-gray-500 to-slate-500",
}

const LEVEL_COLORS: Record<string, string> = {
  beginner:     "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  intermediate: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  advanced:     "text-purple-400 bg-purple-400/10 border-purple-400/20",
  expert:       "text-green-400 bg-green-400/10 border-green-400/20",
}

const STATUS_CONFIG = {
  learning: { icon: BookOpen,     label: "Learning",  cls: "text-yellow-400" },
  learned:  { icon: CheckCircle,  label: "Learned",   cls: "text-blue-400"   },
  mastered: { icon: Zap,          label: "Mastered",  cls: "text-green-400"  },
}

interface SkillCardProps {
  skill: Skill
  index: number
  onOpen: (skill: Skill) => void
}

export function SkillCard({ skill, index, onOpen }: SkillCardProps) {
  const [hovered, setHovered] = useState(false)
  const color = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.other
  const levelCls = LEVEL_COLORS[skill.skill_level] || LEVEL_COLORS.intermediate
  const status = STATUS_CONFIG[skill.learning_status] || STATUS_CONFIG.learned
  const StatusIcon = status.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.07, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onOpen(skill)}
      className="relative group cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`View ${skill.name} details`}
      onKeyDown={(e) => e.key === "Enter" && onOpen(skill)}
    >
      {/* Animated gradient border */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${color} opacity-0 blur-sm`}
        aria-hidden="true"
      />

      {/* Card body */}
      <div className="relative glass rounded-2xl p-5 border border-white/10 group-hover:border-white/0 transition-all duration-300 h-full flex flex-col">
        {/* Featured badge */}
        {skill.featured && (
          <div className="absolute -top-2 -right-2 z-10">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gradient-to-r from-yellow-500 to-amber-500 text-black">
              <Star size={9} fill="currentColor" /> Top
            </span>
          </div>
        )}

        {/* Top row: icon + circular progress */}
        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl shadow-lg`}>
            {skill.icon_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={skill.icon_url} alt={skill.name} className="w-7 h-7 object-contain" />
            ) : (
              <span className="text-xl font-bold text-white">{skill.icon ?? skill.name[0]}</span>
            )}
          </div>

          {/* Circular progress */}
          <CircularProgress
            percentage={skill.proficiency}
            size={56}
            strokeWidth={5}
          />
        </div>

        {/* Name + level */}
        <div className="mb-2">
          <h3 className="text-base font-semibold text-white leading-tight">{skill.name}</h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${levelCls}`}>
              {skill.skill_level}
            </span>
            <span className={`flex items-center gap-1 text-[10px] ${status.cls}`}>
              <StatusIcon size={10} />
              {status.label}
            </span>
          </div>
        </div>

        {/* Description */}
        {skill.description && (
          <p className="text-xs text-white/50 leading-relaxed line-clamp-2 flex-1">
            {skill.description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
          <span className="capitalize">{skill.category.replace("_", " / ")}</span>
          <span>{skill.years_of_experience}y exp</span>
        </div>
      </div>
    </motion.div>
  )
}
