"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"

interface Stat {
  label: string
  value: number
  suffix?: string
  color: string
}

function AnimatedNumber({ value, suffix = "", delay = 0 }: { value: number; suffix?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    const start = performance.now()
    const duration = 1200
    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(step)
      else setDisplay(value)
    }
    const timeout = setTimeout(() => requestAnimationFrame(step), delay * 1000)
    return () => clearTimeout(timeout)
  }, [inView, value, delay])

  return <span ref={ref}>{display}{suffix}</span>
}

interface SkillsStatsProps {
  total: number
  byCategory: Record<string, number>
}

export function SkillsStats({ total, byCategory }: SkillsStatsProps) {
  const stats: Stat[] = [
    { label: "Total Skills",         value: total,                  color: "from-blue-500 to-cyan-500" },
    { label: "Frontend",             value: byCategory.frontend  || 0, color: "from-blue-400 to-indigo-500" },
    { label: "Backend",              value: byCategory.backend   || 0, color: "from-green-500 to-emerald-500" },
    { label: "AI / ML",              value: byCategory.ai_ml     || 0, color: "from-purple-500 to-pink-500" },
    { label: "Languages",            value: byCategory.languages || 0, color: "from-pink-500 to-rose-500" },
    { label: "Tools & Cloud",        value: (byCategory.tools || 0) + (byCategory.cloud || 0), color: "from-teal-500 to-cyan-500" },
  ]

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-12">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className="glass rounded-2xl p-4 border border-white/10 text-center"
        >
          <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
            <AnimatedNumber value={stat.value} delay={i * 0.07} />
          </p>
          <p className="text-xs text-white/45 mt-1 leading-tight">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}
