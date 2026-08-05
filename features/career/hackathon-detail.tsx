"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Code2,
  Cpu,
  GitBranch,
  MonitorPlay,
  ArrowLeft,
  Award,
  Lightbulb,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"
import type { Hackathon } from "@/types"
import { HackathonGalleryCarousel } from "./hackathon-gallery-carousel"
import { HackathonGalleryGrid } from "./hackathon-gallery-grid"

interface HackathonDetailProps {
  hackathon: Hackathon
  related: Hackathon[]
}

export function HackathonDetail({ hackathon: h, related }: HackathonDetailProps) {
  const eventName = h.event_name || h.name

  return (
    <div className="px-4">
      {/* Banner */}
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 pt-8"
        >
          <Link
            href="/hackathons"
            className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to Hackathons
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-12 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#050810] to-[#0a0f1a]"
        >
          {h.image_url && (
            <div className="absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={h.image_url}
                alt={eventName}
                className="h-full w-full object-cover opacity-20 blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/80 to-transparent" />
            </div>
          )}

          <div className="relative z-10 p-8 sm:p-12">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {(h.ranking || h.position || h.prize) && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/15 px-3 py-1 text-sm font-bold text-yellow-400 ring-1 ring-yellow-500/30">
                  <Trophy size={14} />
                  {h.ranking || h.position || h.prize}
                </span>
              )}
              {h.theme && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-3 py-1 text-sm text-rose-300 ring-1 ring-rose-500/30">
                  <Lightbulb size={14} />
                  {h.theme}
                </span>
              )}
            </div>

            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              {eventName}
            </h1>
            <p className="mb-8 text-xl text-white/60">{h.organizer}</p>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-white/40">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(h.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                {h.duration && ` (${h.duration})`}
              </span>
              {h.location && (
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {h.location}
                </span>
              )}
              {h.team_name && (
                <span className="flex items-center gap-2">
                  <Users size={16} />
                  Team {h.team_name}
                  {h.team_size && ` (${h.team_size} members)`}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              {(h.demo_url || h.project_url) && (
                <a
                  href={h.demo_url || h.project_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 font-medium text-white transition-colors hover:bg-rose-500"
                >
                  <MonitorPlay size={18} />
                  Live Demo
                </a>
              )}
              {h.github_url && (
                <a
                  href={h.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 font-medium text-white transition-colors hover:bg-white/5"
                >
                  <GitBranch size={18} />
                  Source Code
                </a>
              )}
              {h.certificate_url && (
                <a
                  href={h.certificate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 font-medium text-white transition-colors hover:bg-white/5"
                >
                  <Award size={18} />
                  View Certificate
                </a>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-12 lg:col-span-2">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-2xl font-semibold text-white">Project Overview</h2>
              <div className="prose prose-invert prose-rose max-w-none">
                <p className="text-lg leading-relaxed text-white/70">{h.description}</p>
              </div>
            </motion.section>

            {h.problem_statement && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="glass rounded-2xl border border-rose-500/20 p-6 sm:p-8">
                  <h2 className="mb-4 flex items-center gap-3 text-xl font-semibold text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
                      <Lightbulb size={18} />
                    </span>
                    The Problem
                  </h2>
                  <p className="whitespace-pre-wrap leading-relaxed text-white/60">
                    {h.problem_statement}
                  </p>
                </div>
              </motion.section>
            )}

            {h.solution && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="glass rounded-2xl border border-emerald-500/20 p-6 sm:p-8">
                  <h2 className="mb-4 flex items-center gap-3 text-xl font-semibold text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 size={18} />
                    </span>
                    The Solution
                  </h2>
                  <p className="whitespace-pre-wrap leading-relaxed text-white/60">
                    {h.solution}
                  </p>
                </div>
              </motion.section>
            )}

            {/* Participation Gallery Carousel & Grid */}
            {h.gallery_items && h.gallery_items.length > 0 ? (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <HackathonGalleryCarousel items={h.gallery_items} />
                <HackathonGalleryGrid items={h.gallery_items} />
              </motion.section>
            ) : (
              <HackathonGalleryGrid items={[]} />
            )}

            {(h.lessons_learned || h.future_improvements) && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid gap-6 sm:grid-cols-2"
              >
                {h.lessons_learned && (
                  <div className="glass rounded-2xl border border-white/10 p-6">
                    <h3 className="mb-3 font-semibold text-white">Lessons Learned</h3>
                    <p className="text-sm text-white/60">{h.lessons_learned}</p>
                  </div>
                )}
                {h.future_improvements && (
                  <div className="glass rounded-2xl border border-white/10 p-6">
                    <h3 className="mb-3 font-semibold text-white">Future Scope</h3>
                    <p className="text-sm text-white/60">{h.future_improvements}</p>
                  </div>
                )}
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {h.tech_stack && h.tech_stack.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl border border-white/10 p-6"
              >
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
                  <Code2 size={16} className="text-rose-400" />
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {h.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-white/70 ring-1 ring-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {h.ai_models && h.ai_models.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl border border-indigo-500/20 p-6"
              >
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
                  <Cpu size={16} className="text-indigo-400" />
                  AI Models Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {h.ai_models.map((model) => (
                    <span
                      key={model}
                      className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-sm text-indigo-300 ring-1 ring-indigo-500/20"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {(h.my_role || (h.mentor_names && h.mentor_names.length > 0)) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl border border-white/10 p-6"
              >
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
                  <Users size={16} className="text-rose-400" />
                  Team & Mentorship
                </h3>
                <div className="space-y-4">
                  {h.my_role && (
                    <div>
                      <p className="text-xs text-white/40">My Role</p>
                      <p className="font-medium text-white/80">{h.my_role}</p>
                    </div>
                  )}
                  {h.mentor_names && h.mentor_names.length > 0 && (
                    <div>
                      <p className="text-xs text-white/40">Mentors / Judges</p>
                      <ul className="mt-1 list-inside list-disc text-sm text-white/70">
                        {h.mentor_names.map((name) => (
                          <li key={name}>{name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 border-t border-white/10 pt-12"
          >
            <h2 className="mb-8 text-2xl font-semibold text-white">Other Hackathons</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={rel.slug ? `/hackathons/${rel.slug}` : "/hackathons"}
                  className="glass glass-hover group flex flex-col overflow-hidden rounded-2xl border border-white/10 transition-all hover:border-rose-500/20"
                >
                  <div className="h-32 w-full bg-white/5">
                    {rel.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={rel.image_url} alt={rel.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="truncate font-semibold text-white group-hover:text-rose-400">
                      {rel.event_name || rel.name}
                    </h3>
                    <p className="mt-1 truncate text-xs text-white/50">{rel.organizer}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}
