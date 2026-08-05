"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Star, ArrowRight } from "lucide-react"
import type { Achievement } from "@/types"

interface AchievementsHighlightProps {
  achievements: Achievement[]
}

export function AchievementsHighlight({ achievements }: AchievementsHighlightProps) {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white">Milestones</h2>
            <p className="mt-2 text-white/50">Key achievements and awards</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/achievements"
              className="group flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-5 py-2 text-sm font-medium text-yellow-400 transition-colors hover:bg-yellow-500/20"
            >
              View All
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass glass-hover group relative overflow-hidden rounded-2xl border border-white/10 p-5 transition-all hover:border-yellow-500/20"
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-yellow-500/5 blur-2xl transition-colors group-hover:bg-yellow-500/10" />
              
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                  <Star size={18} />
                </div>
                
                <h3 className="mb-1 text-sm font-semibold text-white group-hover:text-yellow-400">
                  {a.title}
                </h3>
                {a.organization && (
                  <p className="mb-2 text-xs text-white/50">{a.organization}</p>
                )}
                <p className="mt-auto text-xs leading-relaxed text-white/60 line-clamp-3">
                  {a.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
