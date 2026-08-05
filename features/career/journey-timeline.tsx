"use client"

import { motion } from "framer-motion"
import { Briefcase, GraduationCap, MapPin, Calendar, ExternalLink } from "lucide-react"
import type { Experience, Education } from "@/types"
import Link from "next/link"

import type { JourneyMilestone } from "@/types/about"

interface JourneyTimelineProps {
  experience: Experience[]
  education: Education[]
  milestones?: JourneyMilestone[]
}

type TimelineItem =
  | { type: "experience"; item: Experience; date: string }
  | { type: "education"; item: Education; date: string }
  | { type: "milestone"; item: JourneyMilestone; date: string }

function formatDateRange(start: string, end: string | null, current: boolean): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" })
  return `${fmt(start)} – ${current ? "Present" : end ? fmt(end) : "–"}`
}

export function JourneyTimeline({ experience, education, milestones = [] }: JourneyTimelineProps) {
  // Merge and sort by date descending
  const items: TimelineItem[] = [
    ...experience.map((e) => ({ type: "experience" as const, item: e, date: e.start_date })),
    ...education.map((e) => ({ type: "education" as const, item: e, date: e.start_date })),
    ...milestones.map((m) => ({ type: "milestone" as const, item: m, date: m.year })),
  ].sort((a, b) => {
    const timeA = Date.parse(a.date) || 0
    const timeB = Date.parse(b.date) || 0
    return timeB - timeA
  })

  if (items.length === 0) return null

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-2 font-mono text-xs tracking-widest text-white/40 uppercase">Overview</p>
          <h2 className="gradient-text text-3xl font-bold">Career &amp; Learning Timeline</h2>
        </motion.div>

        <div className="relative">
          {/* Central line */}
          <div className="absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/30 to-transparent sm:left-1/2" />

          <div className="space-y-8">
            {items.map(({ type, item }, index) => {
              const isExp = type === "experience"
              const isEdu = type === "education"
              const isMilestone = type === "milestone"
              const exp = isExp ? (item as Experience) : null
              const edu = isEdu ? (item as Education) : null
              const ms = isMilestone ? (item as JourneyMilestone) : null

              const title = ms ? ms.title : exp ? exp.role : edu!.degree
              const subtitle = ms ? ms.description : exp ? exp.company : edu!.institution
              const dateStr = ms
                ? ms.year
                : exp
                ? formatDateRange(exp.start_date, exp.end_date, exp.current)
                : formatDateRange(edu!.start_date, edu!.end_date ?? null, edu!.current)
              const location = exp ? exp.location : edu ? edu.location : null
              const logo = exp ? exp.company_logo : edu ? edu.institution_logo : null

              return (
                <motion.div
                  key={`${type}-${item.id}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`relative flex items-start gap-6 sm:gap-0 ${
                    index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Content card — takes ~half width */}
                  <div
                    className={`ml-14 flex-1 sm:ml-0 sm:w-[calc(50%-2rem)] ${
                      index % 2 === 0 ? "sm:pr-8 sm:text-right" : "sm:pl-8"
                    }`}
                  >
                    <div className="glass glass-hover group rounded-2xl border border-white/10 p-5 transition-all duration-300 hover:border-white/20">
                      <div
                        className={`mb-3 flex items-center gap-3 ${
                          index % 2 === 0 ? "sm:flex-row-reverse" : ""
                        }`}
                      >
                        {/* Logo / Icon */}
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            isExp
                              ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
                              : "bg-gradient-to-br from-purple-500/20 to-violet-500/20"
                          }`}
                        >
                          {logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={logo}
                              alt={subtitle}
                              className="h-6 w-6 rounded-md object-contain"
                            />
                          ) : isExp ? (
                            <Briefcase
                              size={15}
                              className="text-blue-400"
                            />
                          ) : isMilestone ? (
                            <span className="text-sm">{ms?.icon || "⚡"}</span>
                          ) : (
                            <GraduationCap
                              size={15}
                              className="text-purple-400"
                            />
                          )}
                        </div>
                        <div className={index % 2 === 0 ? "sm:text-right" : ""}>
                          <p className="text-sm font-semibold text-white">{title}</p>
                          <p className="text-xs text-white/60">{subtitle}</p>
                        </div>
                      </div>
                      <div
                        className={`flex flex-wrap items-center gap-3 text-xs text-white/40 ${
                          index % 2 === 0 ? "sm:justify-end" : ""
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {dateStr}
                        </span>
                        {location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-5 top-5 z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center sm:static sm:translate-x-0 sm:self-start sm:pt-5">
                    <div
                      className={`relative h-3 w-3 rounded-full border-2 ${
                        isExp ? "border-blue-400 bg-blue-500/30" : "border-purple-400 bg-purple-500/30"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 animate-ping rounded-full ${
                          isExp ? "bg-blue-400/30" : "bg-purple-400/30"
                        }`}
                        style={{ animationDuration: "3s" }}
                      />
                    </div>
                  </div>

                  {/* Spacer for alternate side */}
                  <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 flex justify-center gap-4"
        >
          <Link
            href="/experience"
            className="glass glass-hover rounded-xl border border-blue-500/20 px-5 py-2.5 text-sm text-blue-400 transition-colors hover:text-white"
          >
            View Full Experience →
          </Link>
          <Link
            href="/education"
            className="glass glass-hover rounded-xl border border-purple-500/20 px-5 py-2.5 text-sm text-purple-400 transition-colors hover:text-white"
          >
            View Education →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
