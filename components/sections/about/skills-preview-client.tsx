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
  frameworks:"from-indigo-500 to-blue-500",
  other:     "from-gray-500 to-slate-500",
}

const CATEGORY_LABELS: Record<string, string> = {
  frontend:  "Frontend",
  backend:   "Backend",
  ai_ml:     "AI / ML",
  database:  "Database",
  devops:    "DevOps",
  cloud:     "Cloud",
  tools:     "Tools",
  languages: "Languages",
  frameworks:"Frameworks",
  other:     "Other",
}

interface SkillsPreviewClientProps {
  byCategory: Record<string, Skill[]>
}

export function SkillsPreviewClient({ byCategory }: SkillsPreviewClientProps) {
  const categories = Object.entries(byCategory)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map(([category, skills], gi) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: gi * 0.08 }}
          className="glass rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-colors group"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${CATEGORY_COLORS[category] || CATEGORY_COLORS.other}`} />
            <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
              {CATEGORY_LABELS[category] || category}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, si) => (
              <motion.span
                key={skill.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: gi * 0.06 + si * 0.04 }}
                className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
              >
                {skill.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
