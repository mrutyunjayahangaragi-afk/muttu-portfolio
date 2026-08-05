"use client"

import { motion } from "framer-motion"
import { GraduationCap, Calendar, MapPin, BookOpen, ExternalLink } from "lucide-react"
import type { Education } from "@/types"
import { EmptyState } from "@/components/ui/empty-state"

function formatYear(date: string) {
  return new Date(date).getFullYear().toString()
}

interface EducationTimelineProps {
  items: Education[]
}

export function EducationTimeline({ items }: EducationTimelineProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon="default"
        title="Education History Coming Soon"
        description="Academic qualifications are being updated. Check back soon for my educational background!"
      />
    )
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent md:left-8" />

      <div className="space-y-10">
        {items.map((edu, index) => {
          const gpa = edu.cgpa || edu.gpa || edu.percentage
          const startYear = formatYear(edu.start_date)
          const endYear = edu.current
            ? "Present"
            : edu.end_date
            ? formatYear(edu.end_date)
            : "–"

          return (
            <motion.article
              key={edu.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -80px 0px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-16 md:pl-20"
              aria-label={`${edu.degree} at ${edu.institution}`}
            >
              {/* Dot */}
              <div className="absolute left-6 top-6 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center md:left-8">
                <div className="relative h-4 w-4 rounded-full border-2 border-purple-400 bg-[#050810]">
                  <div className="absolute inset-0.5 rounded-full bg-purple-500" />
                  {edu.current && (
                    <div className="absolute -inset-1 animate-ping rounded-full border border-purple-400/40" />
                  )}
                </div>
              </div>

              {/* Card */}
              <div className="glass glass-hover group rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/10">
                {/* Header */}
                <div className="mb-4 flex items-start gap-4">
                  {/* Logo */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
                    {edu.institution_logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={edu.institution_logo}
                        alt={edu.institution}
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      <GraduationCap size={20} className="text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                    <p className="text-sm text-white/60">
                      {edu.field_of_study}
                      {edu.branch && ` — ${edu.branch}`}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      {edu.institution_url ? (
                        <a
                          href={edu.institution_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-purple-400 transition-colors hover:text-purple-300"
                        >
                          {edu.institution}
                          <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span className="text-sm text-white/50">{edu.institution}</span>
                      )}
                    </div>
                    {edu.university && edu.university !== edu.institution && (
                      <p className="mt-0.5 text-xs text-white/35">{edu.university}</p>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-col items-end gap-2">
                    {edu.current && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 px-2.5 py-1 text-xs font-medium text-purple-400 ring-1 ring-purple-500/20">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
                        Ongoing
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/40">
                      <Calendar size={10} />
                      {startYear} – {endYear}
                    </span>
                  </div>
                </div>

                {/* GPA + Location row */}
                <div className="mb-4 flex flex-wrap gap-4">
                  {gpa && (
                    <div className="glass rounded-xl border border-purple-500/20 px-4 py-2 text-center">
                      <p className="text-xs text-white/40">CGPA / GPA</p>
                      <p className="text-lg font-bold text-purple-400">{gpa}</p>
                    </div>
                  )}
                  {edu.location && (
                    <div className="flex items-center gap-1.5 text-sm text-white/40">
                      <MapPin size={13} />
                      {edu.location}
                    </div>
                  )}
                </div>

                {/* Description */}
                {edu.description && (
                  <p className="mb-4 text-sm leading-relaxed text-white/55">
                    {edu.description}
                  </p>
                )}

                {/* Subjects */}
                {edu.subjects && edu.subjects.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/30">
                      Key Subjects
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {edu.subjects.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-purple-500/10 px-2.5 py-1 text-xs text-purple-300/70 ring-1 ring-purple-500/15"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activities */}
                {edu.activities && edu.activities.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/30">
                      Activities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {edu.activities.map((a) => (
                        <span
                          key={a}
                          className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/40 ring-1 ring-white/8"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}
