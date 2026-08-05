"use client"

import { useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
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

interface TechCloudItemProps {
  skill: Skill
  index: number
  onOpen: (skill: Skill) => void
}

function TechCloudItem({ skill, index, onOpen }: TechCloudItemProps) {
  const color = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.other

  // Stagger-based float animation
  const floatDuration = 3 + (index % 5) * 0.6
  const floatDelay = (index % 8) * 0.4

  return (
    // Outer div handles the continuous float (tween, not spring)
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: floatDuration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: floatDelay,
      }}
    >
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.04, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.2, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onOpen(skill)}
      className="group relative flex flex-col items-center gap-1.5 p-3 rounded-2xl glass border border-white/10
                 hover:border-white/25 transition-all cursor-pointer"
      aria-label={`${skill.name}: ${skill.proficiency}%`}
      title={`${skill.name} — ${skill.proficiency}%`}
    >
      {/* Glow */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 blur-lg transition-opacity`}
        aria-hidden="true"
      />

      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-lg font-bold text-white shadow-lg relative z-10`}>
        {skill.icon_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={skill.icon_url} alt="" className="w-6 h-6 object-contain" />
        ) : (
          <span className="text-sm">{skill.icon ?? skill.name[0]}</span>
        )}
      </div>

      {/* Name */}
      <span className="relative z-10 text-[11px] font-medium text-white/70 group-hover:text-white transition-colors whitespace-nowrap max-w-[72px] truncate">
        {skill.name}
      </span>
    </motion.button>
    </motion.div>
  )
}

interface TechCloudProps {
  skills: Skill[]
  onOpen: (skill: Skill) => void
}

export function TechCloud({ skills, onOpen }: TechCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  function onMouseMove(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 10
    mouseX.set(nx)
    mouseY.set(ny)
  }

  function onMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-1">Tech Stack</p>
        <h3 className="text-2xl font-bold text-white">Technology Cloud</h3>
        <p className="text-sm text-white/45 mt-1">Click any icon to learn more</p>
      </div>

      <motion.div
        ref={containerRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ x: springX, y: springY }}
        className="flex flex-wrap justify-center gap-3 p-6 rounded-3xl glass border border-white/10"
      >
        {skills.map((skill, i) => (
          <TechCloudItem key={skill.id} skill={skill} index={i} onOpen={onOpen} />
        ))}
      </motion.div>
    </div>
  )
}
