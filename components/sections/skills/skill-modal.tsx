"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, BookOpen, CheckCircle, Zap, Star, Calendar } from "lucide-react"
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
  other:     "from-gray-500 to-slate-500",
}

const LEVEL_BADGES: Record<string, { label: string; cls: string }> = {
  beginner:     { label: "Beginner",     cls: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
  intermediate: { label: "Intermediate", cls: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  advanced:     { label: "Advanced",     cls: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  expert:       { label: "Expert",       cls: "bg-green-500/15 text-green-400 border-green-500/30" },
}

const STATUS_CONFIG = {
  learning: { icon: BookOpen,    label: "Currently Learning", cls: "text-yellow-400" },
  learned:  { icon: CheckCircle, label: "Learned",            cls: "text-blue-400"   },
  mastered: { icon: Zap,         label: "Mastered",           cls: "text-green-400"  },
}

interface SkillModalProps {
  skill: Skill | null
  onClose: () => void
}

export function SkillModal({ skill, onClose }: SkillModalProps) {
  // Trap focus and handle Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  useEffect(() => {
    if (skill) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [skill])

  const color = skill ? (CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.other) : ""
  const level = skill ? LEVEL_BADGES[skill.skill_level] : null
  const status = skill ? STATUS_CONFIG[skill.learning_status] : null
  const StatusIcon = status?.icon ?? CheckCircle

  return (
    <AnimatePresence>
      {skill && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${skill.name} details`}
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative pointer-events-auto w-full max-w-md glass rounded-3xl border border-white/15 overflow-hidden">
              {/* Header gradient */}
              <div className={`h-28 bg-gradient-to-br ${color} relative`}>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
                {skill.featured && (
                  <div className="absolute top-4 left-4 flex items-center gap-1 px-2 py-1 rounded-full bg-black/30 text-xs text-yellow-300">
                    <Star size={10} fill="currentColor" /> Featured
                  </div>
                )}
              </div>

              {/* Icon overlapping header */}
              <div className="px-6 pb-6">
                <div className="flex items-end justify-between -mt-8 mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} border-4 border-[#050810] flex items-center justify-center text-2xl shadow-xl`}>
                    {skill.icon_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={skill.icon_url} alt="" className="w-9 h-9 object-contain" />
                    ) : (
                      <span className="text-xl font-bold text-white">{skill.icon ?? skill.name[0]}</span>
                    )}
                  </div>
                  <CircularProgress percentage={skill.proficiency} size={72} strokeWidth={6} />
                </div>

                {/* Name + level */}
                <h2 className="text-xl font-bold text-white mb-1">{skill.name}</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={cn("text-xs px-2.5 py-1 rounded-full border capitalize", level?.cls)}>
                    {level?.label}
                  </span>
                  <span className={cn("flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-white/10", status?.cls)}>
                    <StatusIcon size={11} />
                    {status?.label}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-white/50 capitalize">
                    {skill.category.replace("_", " / ")}
                  </span>
                </div>

                {/* Description */}
                {skill.description && (
                  <p className="text-sm text-white/65 leading-relaxed mb-4">{skill.description}</p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-xl p-3 border border-white/10 text-center">
                    <p className="text-xl font-bold text-white">{skill.proficiency}%</p>
                    <p className="text-xs text-white/45">Proficiency</p>
                  </div>
                  <div className="glass rounded-xl p-3 border border-white/10 text-center">
                    <p className="text-xl font-bold text-white">{skill.years_of_experience}y</p>
                    <p className="text-xs text-white/45">Experience</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
