"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { Skill } from "@/types"
import { SkillsFilters, type ViewMode } from "./skills-filters"
import { SkillsStats } from "./skills-stats"
import { FeaturedSkills } from "./featured-skills"
import { SkillCard } from "./skill-card"
import { SkillListRow } from "./skill-list-row"
import { SkillModal } from "./skill-modal"
import { TechCloud } from "./tech-cloud"
import { LearningTimeline } from "./learning-timeline"

interface SkillsContentProps {
  skills: Skill[]
  stats: { total: number; byCategory: Record<string, number>; avgProficiency: number }
}

export function SkillsContent({ skills, stats }: SkillsContentProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  const featuredSkills = useMemo(
    () => skills.filter((s) => s.featured).slice(0, 8),
    [skills]
  )

  const filteredSkills = useMemo(() => {
    let result = skills
    if (category !== "all") {
      result = result.filter((s) => s.category === category)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q)
      )
    }
    return result
  }, [skills, category, search])

  return (
    <>
      {/* Stats */}
      <SkillsStats total={stats.total} byCategory={stats.byCategory} />

      {/* Featured */}
      <FeaturedSkills skills={featuredSkills} onOpen={setSelectedSkill} />

      {/* Tech Cloud */}
      <TechCloud skills={skills.slice(0, 24)} onOpen={setSelectedSkill} />

      {/* Filters */}
      <SkillsFilters
        search={search}
        category={category}
        viewMode={viewMode}
        onSearch={setSearch}
        onCategory={setCategory}
        onViewMode={setViewMode}
      />

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-white/45">
          {filteredSkills.length} skill{filteredSkills.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
          {category !== "all" && !search && ` in ${category.replace("_", " / ")}`}
        </p>
      </div>

      {/* Skill Grid / List */}
      <AnimatePresence mode="wait">
        {filteredSkills.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass rounded-2xl p-12 text-center text-white/40"
          >
            No skills match your search.
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredSkills.map((skill, i) => (
              <SkillCard key={skill.id} skill={skill} index={i} onOpen={setSelectedSkill} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {/* List header */}
            <div className="hidden sm:grid grid-cols-[1fr_160px_100px_80px] gap-4 px-4 text-xs text-white/35 uppercase tracking-wider mb-1">
              <span>Skill</span>
              <span>Proficiency</span>
              <span>Level</span>
              <span className="text-right">Exp</span>
            </div>
            {filteredSkills.map((skill, i) => (
              <SkillListRow key={skill.id} skill={skill} index={i} onOpen={setSelectedSkill} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Learning Timeline */}
      <div className="mt-20">
        <LearningTimeline skills={skills} />
      </div>

      {/* Modal */}
      <SkillModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
    </>
  )
}
