"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Trophy, Code2, Users, MapPin, ExternalLink, Calendar, Search, X, GitBranch, MonitorPlay } from "lucide-react"
import type { Hackathon } from "@/types"
import { EmptyState } from "@/components/ui/empty-state"

interface HackathonsGridProps {
  hackathons: Hackathon[]
}

export function HackathonsGrid({ hackathons }: HackathonsGridProps) {
  const [search, setSearch] = useState("")

  const filtered = hackathons.filter((h) => {
    const q = search.toLowerCase()
    const titleMatch = (h.event_name || h.name).toLowerCase().includes(q)
    const orgMatch = h.organizer.toLowerCase().includes(q)
    const techMatch = h.tech_stack?.some((t) => t.toLowerCase().includes(q))
    return titleMatch || orgMatch || techMatch
  })

  return (
    <div>
      {/* Search */}
      <div className="mb-10 flex justify-center">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hackathons, tech stack, organizers..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-rose-500/40 focus:ring-1 focus:ring-rose-500/20"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="projects"
          title="No hackathons found"
          description="Try adjusting your search query to find matching events."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((h, i) => (
              <motion.div
                key={h.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass glass-hover group flex flex-col overflow-hidden rounded-2xl border border-white/10 transition-all hover:border-rose-500/20 hover:shadow-lg hover:shadow-rose-500/10"
              >
                {/* Image / Banner */}
                <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-rose-500/10 to-pink-500/10">
                  {h.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={h.image_url}
                      alt={h.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Trophy size={48} className="text-rose-400/30" />
                    </div>
                  )}
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    {/* Ranking/Prize Badge */}
                    {(h.ranking || h.prize || h.position) && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/90 px-2.5 py-1 text-xs font-bold text-black shadow-lg">
                        <Trophy size={11} className="shrink-0 text-black/70" />
                        {h.ranking || h.position || h.prize}
                      </span>
                    )}
                    {h.featured && !h.ranking && !h.position && !h.prize && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/90 px-2 py-0.5 text-xs font-bold text-white">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-1 text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
                    {h.event_name || h.name}
                  </h3>
                  <p className="mb-4 text-sm text-white/50">{h.organizer}</p>

                  <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/40">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-white/30" />
                      {new Date(h.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                    {h.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-white/30" />
                        {h.location}
                      </span>
                    )}
                    {h.team_size && (
                      <span className="flex items-center gap-1.5">
                        <Users size={12} className="text-white/30" />
                        Team of {h.team_size}
                      </span>
                    )}
                  </div>

                  {h.theme && (
                    <p className="mb-3 text-xs">
                      <span className="text-white/30">Theme: </span>
                      <span className="text-white/70">{h.theme}</span>
                    </p>
                  )}

                  <p className="mb-6 line-clamp-3 text-sm text-white/60">
                    {h.description}
                  </p>

                  <div className="mt-auto">
                    {/* Tech Stack */}
                    {h.tech_stack && h.tech_stack.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {h.tech_stack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/60 ring-1 ring-white/10"
                          >
                            <Code2 size={9} />
                            {tech}
                          </span>
                        ))}
                        {h.tech_stack.length > 4 && (
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/30">
                            +{h.tech_stack.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      {h.slug && (
                        <Link
                          href={`/hackathons/${h.slug}`}
                          className="flex-1 rounded-xl bg-rose-500/15 py-2 text-center text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/25"
                        >
                          View Project
                        </Link>
                      )}
                      {h.github_url && (
                        <a
                          href={h.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                          aria-label="GitHub Repository"
                        >
                          <GitBranch size={16} />
                        </a>
                      )}
                      {(h.demo_url || h.project_url) && (
                        <a
                          href={h.demo_url || h.project_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                          aria-label="Live Demo"
                        >
                          <MonitorPlay size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
