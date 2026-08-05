/**
 * components/sections/about/skills-preview.tsx
 *
 * Server Component — fetches real skills from the database grouped by category.
 * Displays only what the admin has added — never shows hardcoded data.
 * If no skills exist yet, shows an elegant empty state.
 */
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getSkills } from "@/services/skills"
import type { Skill } from "@/types"
import { SkillsPreviewClient } from "./skills-preview-client"

export async function SkillsPreview() {
  const skills = await getSkills().catch(() => [])

  if (skills.length === 0) {
    return (
      <section aria-label="Skills preview">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-mono text-green-400 uppercase tracking-widest mb-1">Tech Stack</p>
            <h2 className="text-3xl font-bold text-white">Skills Preview</h2>
          </div>
        </div>
        <div className="glass rounded-2xl p-12 border border-white/10 text-center">
          <p className="text-4xl mb-3" aria-hidden="true">💻</p>
          <p className="text-white/60 text-sm">Skills will appear here once added.</p>
          <p className="text-white/30 text-xs mt-1">Add skills through the admin dashboard.</p>
        </div>
      </section>
    )
  }

  // Group by category
  const byCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || "other"
    ;(acc[cat] = acc[cat] || []).push(skill)
    return acc
  }, {})

  return (
    <section aria-label="Skills preview">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-mono text-green-400 uppercase tracking-widest mb-1">Tech Stack</p>
          <h2 className="text-3xl font-bold text-white">Skills Preview</h2>
        </div>
        <Link
          href="#skills"
          className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>
      <SkillsPreviewClient byCategory={byCategory} />
    </section>
  )
}
