"use client"

import { motion } from "framer-motion"
import {
  Briefcase,
  MapPin,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Code2,
  Users,
} from "lucide-react"
import type { Experience } from "@/types"

const TYPE_LABELS: Record<string, string> = {
  full_time: "Full-Time",
  part_time: "Part-Time",
  internship: "Internship",
  freelance: "Freelance",
  contract: "Contract",
}

const TYPE_COLORS: Record<string, string> = {
  full_time: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  part_time: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  internship: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  freelance: "bg-green-500/15 text-green-400 border-green-500/20",
  contract: "bg-orange-500/15 text-orange-400 border-orange-500/20",
}

import { EmptyState } from "@/components/ui/empty-state"

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

interface ExperienceTimelineProps {
  items: Experience[]
}

export function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon="files"
        title="Experience Coming Soon"
        description="I am currently building my professional track record. Check back soon for updates!"
      />
    )
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent md:left-8" />

      <div className="space-y-10">
        {items.map((exp, index) => {
          const typeKey = exp.employment_type || exp.type || "full_time"
          return (
            <motion.article
              key={exp.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -80px 0px" }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="relative pl-16 md:pl-20"
              aria-label={`${exp.role} at ${exp.company}`}
            >
              {/* Timeline dot */}
              <div className="absolute left-6 top-6 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center md:left-8">
                <div className="relative h-4 w-4 rounded-full border-2 border-blue-400 bg-[#050810]">
                  <div className="absolute inset-0.5 rounded-full bg-blue-500" />
                  {exp.current && (
                    <div className="absolute -inset-1 animate-ping rounded-full border border-blue-400/40" />
                  )}
                </div>
              </div>

              {/* Card */}
              <div className="glass glass-hover group rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10">
                {/* Header */}
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
                      {exp.company_logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={exp.company_logo}
                          alt={exp.company}
                          className="h-10 w-10 object-contain"
                        />
                      ) : (
                        <span className="text-lg font-bold text-white/60">
                          {exp.company[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        {exp.company_url ? (
                          <a
                            href={exp.company_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 transition-colors hover:text-blue-400"
                          >
                            {exp.company}
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span>{exp.company}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {exp.current && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-medium text-green-400 ring-1 ring-green-500/20">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                        Current
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                        TYPE_COLORS[typeKey] || TYPE_COLORS.full_time
                      }`}
                    >
                      {TYPE_LABELS[typeKey] || typeKey}
                    </span>
                  </div>
                </div>

                {/* Meta */}
                <div className="mb-4 flex flex-wrap gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(exp.start_date)} –{" "}
                    {exp.current ? "Present" : exp.end_date ? formatDate(exp.end_date) : "–"}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {exp.location}
                    </span>
                  )}
                  {exp.team_size && (
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {exp.team_size} member{exp.team_size > 1 ? "s" : ""} team
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mb-4 text-sm leading-relaxed text-white/60">{exp.description}</p>

                {/* Responsibilities */}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/30">
                      Responsibilities
                    </h4>
                    <ul className="space-y-1.5">
                      {exp.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/55">
                          <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-blue-400/60" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Achievements */}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/30">
                      Key Achievements
                    </h4>
                    <ul className="space-y-1.5">
                      {exp.achievements.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/55">
                          <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-green-400/60" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack */}
                {exp.tech_stack && exp.tech_stack.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/50 ring-1 ring-white/8 transition-colors hover:bg-white/10 hover:text-white/80"
                      >
                        <Code2 size={10} />
                        {tech}
                      </span>
                    ))}
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
