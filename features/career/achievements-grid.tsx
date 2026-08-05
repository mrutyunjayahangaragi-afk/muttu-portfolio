"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Trophy, Target, FileText, GitPullRequest, Search, X, type LucideIcon } from "lucide-react"
import type { Achievement } from "@/types"

interface AchievementsGridProps {
  achievements: Achievement[]
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  award: Trophy,
  competition: Target,
  scholarship: Star,
  publication: FileText,
  open_source: GitPullRequest,
  ranking: Trophy,
}

const CATEGORIES = ["All", "Award", "Competition", "Scholarship", "Ranking", "Publication", "Open Source", "Leadership"]

export function AchievementsGrid({ achievements }: AchievementsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [search, setSearch] = useState("")

  const filtered = achievements.filter((a) => {
    const matchesCategory =
      selectedCategory === "All" ||
      a.category.replace("_", " ").toLowerCase() === selectedCategory.toLowerCase()
    
    const q = search.toLowerCase()
    const matchesSearch =
      !search ||
      a.title.toLowerCase().includes(q) ||
      a.organization?.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q)

    return matchesCategory && matchesSearch
  })

  return (
    <div>
      {/* Controls */}
      <div className="mb-10 flex flex-col items-center justify-between gap-6 sm:flex-row">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/30"
                  : "glass border border-white/10 text-white/50 hover:border-white/20 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search achievements..."
            className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-yellow-500/40 focus:ring-1 focus:ring-yellow-500/20"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-3xl border border-white/10 p-16 text-center">
          <Star size={40} className="mx-auto mb-4 text-white/20" />
          <p className="text-white/40">No achievements found.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((a, i) => {
              const Icon = CATEGORY_ICONS[a.category] || Star
              return (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="glass glass-hover group relative overflow-hidden rounded-2xl border border-white/10 p-6 transition-all hover:border-yellow-500/20 hover:shadow-lg hover:shadow-yellow-500/10"
                >
                  <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-yellow-500/5 blur-3xl transition-colors group-hover:bg-yellow-500/10" />

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 shadow-inner">
                        <Icon size={24} className="text-yellow-400" />
                      </div>
                      {a.award_date && (
                        <span className="text-xs text-white/40">
                          {new Date(a.award_date).getFullYear()}
                        </span>
                      )}
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                      {a.title}
                    </h3>
                    {a.organization && (
                      <p className="mb-3 text-sm font-medium text-white/50">{a.organization}</p>
                    )}
                    
                    <p className="text-sm leading-relaxed text-white/60 flex-1">
                      {a.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/40">
                        {a.category.replace("_", " ")}
                      </span>
                      {a.featured && (
                        <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-yellow-500/80">
                          <Star size={10} className="fill-yellow-500/80" />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
