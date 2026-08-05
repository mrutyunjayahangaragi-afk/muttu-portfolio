"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { Project } from "@/types"
import { ProjectCard } from "./project-card"
import { ProjectsFilters } from "./projects-filters"

interface ProjectsContentProps {
  projects: Project[]
}

export function ProjectsContent({ projects }: ProjectsContentProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [sort, setSort] = useState("newest")

  const filtered = useMemo(() => {
    let result = [...projects]

    // Category filter
    if (category !== "all") {
      result = result.filter((p) => p.category === category)
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tech_stack.some((t) => t.toLowerCase().includes(q)) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      )
    }

    // Sort
    switch (sort) {
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case "featured":
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      case "az":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      default: // newest
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return result
  }, [projects, search, category, sort])

  return (
    <>
      <ProjectsFilters
        search={search}
        category={category}
        sort={sort}
        onSearch={setSearch}
        onCategory={setCategory}
        onSort={setSort}
      />

      {/* Result count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-white/45">
          {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
        </p>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass rounded-2xl p-16 text-center text-white/40"
          >
            No projects match your search.
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
