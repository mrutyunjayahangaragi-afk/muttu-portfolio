"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import type { JourneyMilestone } from "@/types/about"

interface MilestoneItemProps {
  milestone: JourneyMilestone
  index: number
  isLeft: boolean
  isLast: boolean
}

function MilestoneItem({ milestone, index, isLeft, isLast }: MilestoneItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <div ref={ref} className={`relative flex gap-4 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}>
      {/* Connector */}
      <div className="relative flex flex-col items-center md:items-center shrink-0">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.08 }}
          className={`relative z-10 w-10 h-10 rounded-2xl bg-gradient-to-br ${milestone.color}
                       flex items-center justify-center text-lg shadow-lg shrink-0`}
        >
          {milestone.icon}
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.08 + 0.2 }}
            className="flex-1 w-px bg-gradient-to-b from-white/20 to-transparent mt-2 origin-top"
            style={{ minHeight: 32 }}
          />
        )}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.08 + 0.05 }}
        className={`pb-6 flex-1 ${isLeft ? "" : "md:text-right"}`}
      >
        <div className="glass rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-colors group inline-block w-full">
          <div className={`flex items-start justify-between gap-2 mb-1.5 ${isLeft ? "" : "md:flex-row-reverse"}`}>
            <h4 className="text-sm font-semibold text-white">{milestone.title}</h4>
            <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-mono
                             bg-gradient-to-r ${milestone.color} bg-clip-text text-transparent
                             border border-white/10`}>
              {milestone.year}
            </span>
          </div>
          <p className="text-xs text-white/55 leading-relaxed">{milestone.description}</p>
        </div>
      </motion.div>
    </div>
  )
}

interface JourneyTimelineProps {
  milestones: JourneyMilestone[]
}

export function JourneyTimeline({ milestones }: JourneyTimelineProps) {
  return (
    <section aria-label="My journey milestones">
      <div className="text-center mb-12">
        <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2">The Road So Far</p>
        <h2 className="text-3xl font-bold text-white">My Journey</h2>
        <p className="text-white/50 text-sm mt-2 max-w-md mx-auto">
          Key milestones that shaped me as a developer and problem-solver.
        </p>
      </div>

      {milestones.length === 0 ? (
        <div className="glass rounded-2xl p-12 border border-white/10 text-center">
          <p className="text-4xl mb-3" aria-hidden="true">🗺️</p>
          <p className="text-white/50 text-sm">No journey milestones added yet.</p>
          <p className="text-white/30 text-xs mt-1">Add milestones through the admin dashboard.</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {milestones.map((milestone, i) => (
            <MilestoneItem
              key={milestone.id}
              milestone={milestone}
              index={i}
              isLeft={i % 2 === 0}
              isLast={i === milestones.length - 1}
            />
          ))}
        </div>
      )}
    </section>
  )
}
