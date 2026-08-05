"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { GraduationCap, Calendar, MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Education } from "@/types"

interface TimelineItemProps {
  item: Education
  index: number
  isLast: boolean
}

function TimelineItem({ item, index, isLast }: TimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const startYear = new Date(item.start_date).getFullYear()
  const endLabel = item.current
    ? "Present"
    : item.end_date
    ? new Date(item.end_date).getFullYear().toString()
    : "—"

  return (
    <div ref={ref} className="relative flex gap-6">
      {/* Timeline spine + dot */}
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600
                     flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0"
        >
          <GraduationCap size={18} className="text-white" />
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.2, ease: "easeOut" }}
            className="flex-1 w-px bg-gradient-to-b from-blue-500/60 to-transparent mt-2 origin-top"
            style={{ minHeight: 40 }}
          />
        )}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.05, ease: "easeOut" }}
        className={`pb-8 ${isLast ? "" : ""} w-full`}
      >
        <div className="glass rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-colors group">
          {/* Year badge */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h4 className="text-base font-semibold text-white">{item.degree}</h4>
              <p className="text-sm text-blue-400 font-medium">{item.field_of_study}</p>
            </div>
            <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20 font-mono">
              {startYear} – {endLabel}
            </span>
          </div>

          <p className="text-sm text-white/70 font-medium mb-2">{item.institution}</p>

          <div className="flex flex-wrap gap-3 text-xs text-white/45">
            {item.location && (
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {item.location}
              </span>
            )}
            {item.gpa && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                GPA / Score: {item.gpa}
              </span>
            )}
            {item.current && (
              <span className="flex items-center gap-1 text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Currently Enrolled
              </span>
            )}
          </div>

          {item.description && (
            <p className="mt-2.5 text-xs text-white/50 leading-relaxed">{item.description}</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

interface EducationTimelineProps {
  education: Education[]
}

export function EducationTimeline({ education }: EducationTimelineProps) {
  return (
    <div className="space-y-0">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <GraduationCap size={20} className="text-blue-400" />
        Education
      </h3>

      {education.length === 0 ? (
        <div className="glass rounded-2xl p-6 border border-white/10 text-center text-white/40 text-sm">
          No education added yet.
        </div>
      ) : (
        <div>
          {education.map((item, i) => (
            <TimelineItem
              key={item.id}
              item={item}
              index={i}
              isLast={i === education.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
