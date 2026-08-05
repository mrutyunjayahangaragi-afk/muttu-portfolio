"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import type { AboutStat } from "@/types/about"

interface StatItemProps {
  stat: AboutStat
  index: number
}

function StatItem({ stat, index }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ scale: 1.06, y: -4 }}
      className="relative group glass rounded-2xl p-5 border border-white/10
                 hover:border-white/20 transition-colors cursor-default text-center"
    >
      {/* Gradient glow */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0
                    group-hover:opacity-15 blur-xl transition-opacity duration-300`}
        aria-hidden="true"
      />

      <div className="relative space-y-1.5">
        <span className="text-3xl" aria-hidden="true">{stat.icon}</span>
        <p className="text-2xl font-bold text-white leading-none">{stat.value}</p>
        <p className="text-xs text-white/55 leading-snug">{stat.label}</p>
      </div>
    </motion.div>
  )
}

interface AboutStatsProps {
  stats: AboutStat[]
}

export function AboutStats({ stats }: AboutStatsProps) {
  if (!stats.length) return (
    <div className="glass rounded-2xl p-8 border border-white/10 text-center">
      <p className="text-white/40 text-sm">No statistics added yet.</p>
    </div>
  )
  return (
    <div
      className="grid grid-cols-3 gap-3"
      aria-label="Achievement statistics"
    >
      {stats.map((stat, i) => (
        <StatItem key={stat.id} stat={stat} index={i} />
      ))}
    </div>
  )
}
