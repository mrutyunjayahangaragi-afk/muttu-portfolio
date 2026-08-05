"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { Award, Trophy, Star, Briefcase, Users, BookOpen } from "lucide-react"

interface CareerStatsProps {
  stats: {
    certificates: number
    hackathons: number
    achievements: number
    experience: number
    leadership: number
    yearsLearning: number
  }
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { bounce: 0, duration: 2000 })
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" })

  useEffect(() => {
    if (isInView) motionValue.set(value)
  }, [isInView, motionValue, value])

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) ref.current.textContent = Math.round(latest).toString() + suffix
    })
  }, [springValue, suffix])

  return <span ref={ref}>0{suffix}</span>
}

const STAT_ITEMS = [
  {
    key: "certificates" as const,
    label: "Certificates",
    icon: Award,
    color: "from-emerald-500 to-teal-500",
    textColor: "text-emerald-400",
    suffix: "+",
  },
  {
    key: "hackathons" as const,
    label: "Hackathons",
    icon: Trophy,
    color: "from-rose-500 to-pink-500",
    textColor: "text-rose-400",
    suffix: "+",
  },
  {
    key: "achievements" as const,
    label: "Achievements",
    icon: Star,
    color: "from-yellow-500 to-orange-500",
    textColor: "text-yellow-400",
    suffix: "+",
  },
  {
    key: "experience" as const,
    label: "Positions",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-500",
    textColor: "text-blue-400",
    suffix: "",
  },
  {
    key: "leadership" as const,
    label: "Leadership Roles",
    icon: Users,
    color: "from-purple-500 to-violet-500",
    textColor: "text-purple-400",
    suffix: "",
  },
  {
    key: "yearsLearning" as const,
    label: "Years Learning",
    icon: BookOpen,
    color: "from-sky-500 to-indigo-500",
    textColor: "text-sky-400",
    suffix: "+",
  },
]

export function CareerStats({ stats }: CareerStatsProps) {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {STAT_ITEMS.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass glass-hover group rounded-2xl border border-white/10 p-5 text-center"
            >
              <div
                className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.color}`}
              >
                <item.icon size={18} className="text-white" />
              </div>
              <div className={`text-3xl font-bold ${item.textColor}`}>
                <AnimatedNumber value={stats[item.key]} suffix={item.suffix} />
              </div>
              <p className="mt-1 text-xs text-white/40">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function StatsSkeleton() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl border border-white/10 p-5">
              <div className="mx-auto mb-3 h-10 w-10 animate-pulse rounded-xl bg-white/10" />
              <div className="mx-auto h-8 w-12 animate-pulse rounded bg-white/10" />
              <div className="mx-auto mt-2 h-3 w-20 animate-pulse rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
