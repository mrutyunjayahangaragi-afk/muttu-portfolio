"use client"

import { motion } from "framer-motion"
import { Search, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export const CATEGORIES = [
  { id: "all",         label: "All" },
  { id: "web",         label: "Web Dev" },
  { id: "ai",          label: "AI" },
  { id: "ml",          label: "ML" },
  { id: "mobile",      label: "Mobile" },
  { id: "backend",     label: "Backend" },
  { id: "fullstack",   label: "Full Stack" },
  { id: "hackathon",   label: "Hackathon" },
  { id: "open_source", label: "Open Source" },
]

export const SORT_OPTIONS = [
  { id: "newest",   label: "Newest" },
  { id: "oldest",   label: "Oldest" },
  { id: "featured", label: "Featured" },
  { id: "az",       label: "A–Z" },
]

interface ProjectsFiltersProps {
  search: string
  category: string
  sort: string
  onSearch: (q: string) => void
  onCategory: (c: string) => void
  onSort: (s: string) => void
}

export function ProjectsFilters({
  search, category, sort, onSearch, onCategory, onSort,
}: ProjectsFiltersProps) {
  return (
    <div className="space-y-4 mb-10">
      {/* Search + sort row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          <input
            type="search"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-white/5 border border-white/10
                       text-sm text-white placeholder:text-white/35
                       focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            aria-label="Search projects"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-white/40" />
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value)}
            className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Sort projects"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={category === cat.id}
            onClick={() => onCategory(cat.id)}
            className={cn(
              "relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
              category === cat.id ? "text-white" : "text-white/55 hover:text-white hover:bg-white/8"
            )}
          >
            {category === cat.id && (
              <motion.div
                layoutId="proj-cat-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
