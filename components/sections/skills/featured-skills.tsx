"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import type { Skill } from "@/types"
import { CircularProgress } from "./circular-progress"

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

interface FeaturedSkillsProps {
  skills: Skill[]
  onOpen: (skill: Skill) => void
}

export function FeaturedSkills({ skills, onOpen }: FeaturedSkillsProps) {
  if (!skills.length) return null

  return (
    <div className="mb-16">
      <div className="flex items-center gap-2 mb-6">
        <Star size={18} className="text-yellow-400" fill="currentColor" />
        <h3 className="text-lg font-semibold text-white">Top Skills</h3>
        <span className="text-xs text-white/40">— highest proficiency</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {skills.map((skill, i) => {
          const color = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.other
          return (
            <motion.button
              key={skill.id}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpen(skill)}
              className={`flex items-center gap-2.5 pl-3 pr-4 py-2 rounded-full glass
                          border border-white/10 hover:border-white/25 transition-all group`}
              aria-label={`${skill.name}: ${skill.proficiency}%`}
            >
              {/* Icon */}
              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                {skill.icon ?? skill.name[0]}
              </div>
              <span className="text-sm font-medium text-white/85 group-hover:text-white transition-colors">
                {skill.name}
              </span>
              {/* Mini progress */}
              <span className={`text-xs font-mono bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                {skill.proficiency}%
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
