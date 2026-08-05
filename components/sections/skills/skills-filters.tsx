"use client"

import { motion } from "framer-motion"
import { Search, Grid, List } from "lucide-react"
import { cn } from "@/lib/utils"

export type ViewMode = "grid" | "list"

const CATEGORY_TABS = [
  { id: "all",       label: "All" },
  { id: "frontend",  label: "Frontend" },
  { id: "backend",   label: "Backend" },
  { id: "ai_ml",     label: "AI / ML" },
  { id: "database",  label: "Database" },
  { id: "devops",    label: "DevOps" },
  { id: "cloud",     label: "Cloud" },
  { id: "tools",     label: "Tools" },
  { id: "languages", label: "Languages" },
]

interface SkillsFiltersProps {
  search: string
  category: string
  viewMode: ViewMode
  onSearch: (q: string) => void
  onCategory: (cat: string) => void
  onViewMode: (mode: ViewMode) => void
}

export function SkillsFilters({
  search,
  category,
  viewMode,
  onSearch,
  onCategory,
  onViewMode,
}: SkillsFiltersProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* Top row: Search + view toggle */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search skills…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-white/5 border border-white/10
                       text-sm text-white placeholder:text-white/35
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50
                       transition-all"
            aria-label="Search skills"
          />
        </div>

        {/* View mode */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            onClick={() => onViewMode("grid")}
            className={cn(
              "p-2 rounded-lg transition-all",
              viewMode === "grid" ? "bg-blue-600 text-white" : "text-white/50 hover:text-white"
            )}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            <Grid size={15} />
          </button>
          <button
            onClick={() => onViewMode("list")}
            className={cn(
              "p-2 rounded-lg transition-all",
              viewMode === "list" ? "bg-blue-600 text-white" : "text-white/50 hover:text-white"
            )}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={category === tab.id}
            onClick={() => onCategory(tab.id)}
            className={cn(
              "relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
              category === tab.id
                ? "text-white"
                : "text-white/55 hover:text-white hover:bg-white/8"
            )}
          >
            {category === tab.id && (
              <motion.div
                layoutId="category-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
