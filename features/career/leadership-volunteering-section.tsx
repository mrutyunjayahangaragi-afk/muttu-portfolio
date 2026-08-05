"use client"

import { motion } from "framer-motion"
import { Users, Heart, Calendar } from "lucide-react"
import type { Leadership, Volunteering } from "@/types"

interface LeadershipVolunteeringProps {
  leadership: Leadership[]
  volunteering: Volunteering[]
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

export function LeadershipVolunteeringSection({ leadership, volunteering }: LeadershipVolunteeringProps) {
  return (
    <section id="leadership" className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Leadership Column */}
          {leadership.length > 0 && (
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Users size={24} />
                </div>
                <h2 className="text-3xl font-bold text-white">Leadership Roles</h2>
                <p className="mt-2 text-white/50">Guiding teams and managing initiatives</p>
              </motion.div>

              <div className="space-y-4">
                {leadership.map((l, i) => (
                  <motion.div
                    key={l.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-2xl border border-white/10 p-5 transition-colors hover:border-blue-500/20"
                  >
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white">{l.title}</h3>
                        <p className="text-sm text-white/60">{l.organization}</p>
                      </div>
                      {(l.start_date || l.end_date) && (
                        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/40">
                          <Calendar size={11} />
                          {l.start_date ? formatDate(l.start_date) : ""} –{" "}
                          {l.current ? "Present" : l.end_date ? formatDate(l.end_date) : ""}
                        </span>
                      )}
                    </div>
                    {l.description && (
                      <p className="mb-3 text-sm leading-relaxed text-white/50">{l.description}</p>
                    )}
                    {l.achievements && l.achievements.length > 0 && (
                      <ul className="space-y-1 text-sm text-white/60">
                        {l.achievements.map((a, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-400/50" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Volunteering Column */}
          {volunteering.length > 0 && (
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
                  <Heart size={24} />
                </div>
                <h2 className="text-3xl font-bold text-white">Volunteering</h2>
                <p className="mt-2 text-white/50">Giving back to the community</p>
              </motion.div>

              <div className="space-y-4">
                {volunteering.map((v, i) => (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-2xl border border-white/10 p-5 transition-colors hover:border-pink-500/20"
                  >
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white">{v.title}</h3>
                        <p className="text-sm text-white/60">{v.organization}</p>
                      </div>
                      {(v.start_date || v.end_date) && (
                        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/40">
                          <Calendar size={11} />
                          {v.start_date ? formatDate(v.start_date) : ""} –{" "}
                          {v.current ? "Present" : v.end_date ? formatDate(v.end_date) : ""}
                        </span>
                      )}
                    </div>
                    {v.description && (
                      <p className="mb-3 text-sm leading-relaxed text-white/50">{v.description}</p>
                    )}
                    {v.impact && (
                      <div className="mt-3 rounded-xl bg-pink-500/5 p-3 text-sm">
                        <span className="font-medium text-pink-400/80">Impact: </span>
                        <span className="text-white/60">{v.impact}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
