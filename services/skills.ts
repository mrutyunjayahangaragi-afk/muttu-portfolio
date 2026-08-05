import "server-only"

import { createStaticClient } from "@/lib/supabase/server"
import type { Skill, SkillCategory_DB } from "@/types"
import { unstable_cache } from "next/cache"

async function fetchSkills(): Promise<Skill[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("order", { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as Skill[]
}

export const getSkills = unstable_cache(
  async () => fetchSkills(),
  ["all-skills-data"],
  { revalidate: 3600, tags: ["skills"] }
)

export async function getFeaturedSkills(): Promise<Skill[]> {
  const all = await getSkills()
  return all.filter((s) => s.featured)
}

export async function getSkillsByCategory(category: string): Promise<Skill[]> {
  const all = await getSkills()
  return all.filter((s) => s.category === category)
}

async function fetchSkillCategories(): Promise<SkillCategory_DB[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("skill_categories")
    .select("*")
    .order("display_order", { ascending: true })
    .order("order", { ascending: true })

  if (error) return []
  return (data ?? []) as SkillCategory_DB[]
}

export const getSkillCategories = unstable_cache(
  async () => fetchSkillCategories(),
  ["all-skill-categories"],
  { revalidate: 3600, tags: ["skills"] }
)

export async function getSkillStats() {
  const skills = await getSkills()
  const total = skills.length
  const byCategory: Record<string, number> = {}
  skills.forEach((s) => {
    byCategory[s.category] = (byCategory[s.category] || 0) + 1
  })
  const avgProficiency =
    total > 0 ? Math.round(skills.reduce((a, s) => a + (s.proficiency || 0), 0) / total) : 0

  return { total, byCategory, avgProficiency }
}
