"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Trophy, ArrowRight } from "lucide-react"
import type { Hackathon } from "@/types"

interface FeaturedHackathonsSectionProps {
  hackathons: Hackathon[]
}

export function FeaturedHackathonsSection({ hackathons }: FeaturedHackathonsSectionProps) {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white">Winning Hacks</h2>
            <p className="mt-2 text-white/50">Featured hackathons and competitions</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/hackathons"
              className="group flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-5 py-2 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/20"
            >
              View All
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hackathons.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={h.slug ? `/hackathons/${h.slug}` : "/hackathons"}
                className="glass glass-hover group block overflow-hidden rounded-2xl border border-white/10 transition-all hover:border-rose-500/20 hover:shadow-lg hover:shadow-rose-500/10"
              >
                <div className="relative h-48 w-full bg-rose-500/5">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050810] to-transparent opacity-80" />
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    {(h.ranking || h.position || h.prize) && (
                      <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-yellow-500/90 px-2 py-0.5 text-xs font-bold text-black">
                        <Trophy size={10} className="shrink-0" />
                        {h.ranking || h.position || h.prize}
                      </span>
                    )}
                    <h3 className="truncate font-semibold text-white group-hover:text-rose-400">
                      {h.event_name || h.name}
                    </h3>
                    <p className="truncate text-xs text-white/50">{h.organizer}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
