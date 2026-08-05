"use client"

import { motion } from "framer-motion"
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

interface SkillListRowProps {
  skill: Skill
  index: number
  onOpen: (skill: Skill) => void
}

export function SkillListRow({ skill, index, onOpen }: SkillListRowProps) {
  const color = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.other

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.3, delay: (index % 12) * 0.04 }}
      onClick={() => onOpen(skill)}
      className="group flex items-center gap-4 p-4 glass rounded-xl border border-white/10
                 hover:border-white/20 transition-all cursor-pointer hover:bg-white/[0.03]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(skill)}
      aria-label={`View ${skill.name} details`}
    >
      {/* Icon */}
      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} shrink-0 flex items-center justify-center text-sm font-bold text-white`}>
        {skill.icon ?? skill.name[0]}
      </div>

      {/* Name + category */}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-white">{skill.name}</span>
        <p className="text-xs text-white/40 capitalize">{skill.category.replace("_", " / ")}</p>
      </div>

      {/* Progress bar */}
      <div className="hidden sm:flex items-center gap-2 w-32">
        <div className="flex-1 h-1.5 rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.proficiency}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.03 }}
            className={`h-1.5 rounded-full bg-gradient-to-r ${color}`}
          />
        </div>
        <span className="text-xs text-white/50 w-8 text-right">{skill.proficiency}%</span>
      </div>

      {/* Level */}
      <span className="hidden md:block text-xs text-white/40 capitalize w-20 text-right">
        {skill.skill_level}
      </span>

      {/* Experience */}
      <span className="hidden lg:block text-xs text-white/40 w-16 text-right shrink-0">
        {skill.years_of_experience}y
      </span>
    </motion.div>
  )
}
