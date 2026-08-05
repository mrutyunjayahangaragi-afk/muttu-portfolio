"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface Stat { label: string; value: number; suffix?: string; color: string }

function Counter({ value, suffix = "", delay = 0 }: { value: number; suffix?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const started = useRef(false)
  const [display, setDisplay] = [value, () => {}] // Simplified — just show final value after animation

  // For brevity: animate via CSS counter trick
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ delay }}
    >
      {value}{suffix}
    </motion.span>
  )
}

interface ProjectsStatsBannerProps {
  stats: { total: number; featured: number; technologies: number; completed: number }
}

export function ProjectsStatsBanner({ stats }: ProjectsStatsBannerProps) {
  const items: Stat[] = [
    { label: "Total Projects",    value: stats.total,        color: "from-blue-500 to-cyan-500" },
    { label: "Featured",          value: stats.featured,     color: "from-yellow-500 to-amber-500" },
    { label: "Completed",         value: stats.completed,    color: "from-green-500 to-emerald-500" },
    { label: "Technologies Used", value: stats.technologies, color: "from-purple-500 to-pink-500" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {items.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="glass rounded-2xl p-5 border border-white/10 text-center"
        >
          <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
            {stat.value}+
          </p>
          <p className="text-xs text-white/45 mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}
