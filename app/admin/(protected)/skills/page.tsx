import type { Metadata } from "next"
import { Plus, Pencil, Star } from "lucide-react"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { DeleteButton } from "@/features/admin/delete-button"
import { SkillFeaturedToggle } from "@/features/admin/skill-featured-toggle"
import { deleteSkillAction } from "./skill-actions"
import type { Skill } from "@/types"

export const metadata: Metadata = {
  title: "Skills — Admin",
  robots: { index: false, follow: false },
}

const CATEGORY_COLORS: Record<string, string> = {
  frontend:  "from-blue-500 to-cyan-500",
  backend:   "from-green-500 to-emerald-500",
  ai_ml:     "from-purple-500 to-pink-500",
  database:  "from-orange-500 to-amber-500",
  devops:    "from-red-500 to-orange-500",
  cloud:     "from-sky-500 to-blue-500",
  tools:     "from-teal-500 to-cyan-500",
  languages: "from-pink-500 to-rose-500",
  other:     "from-gray-500 to-slate-500",
}

export default async function AdminSkillsPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("category", { ascending: true })
    .order("order", { ascending: true })

  const byCategory = (skills ?? []).reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || "other"
    ;(acc[cat] = acc[cat] || []).push(skill as Skill)
    return acc
  }, {})

  const totalFeatured = skills?.filter((s) => s.featured).length ?? 0

  return (
    <div>
      <AdminPageHeader
        title="Skills"
        description={`${skills?.length ?? 0} total · ${totalFeatured} featured`}
      >
        <a
          href="/admin/skills/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Skill
        </a>
      </AdminPageHeader>

      {Object.keys(byCategory).length === 0 && (
        <div className="glass rounded-2xl p-12 text-center text-white/40">
          No skills yet. Click "Add Skill" to start.
        </div>
      )}

      {Object.entries(byCategory).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-white/40 mb-3 px-1 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${CATEGORY_COLORS[category] || CATEGORY_COLORS.other}`} />
            {category.replace("_", " / ")}
            <span className="text-white/20">({items.length})</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((skill) => (
              <div
                key={skill.id}
                className="glass rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors flex items-center gap-3"
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${CATEGORY_COLORS[category] || CATEGORY_COLORS.other} shrink-0 flex items-center justify-center text-sm font-bold text-white`}>
                  {skill.icon_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={skill.icon_url} alt="" className="w-5 h-5 object-contain" />
                  ) : (
                    skill.icon ?? skill.name[0]
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-white truncate">{skill.name}</p>
                    {skill.featured && (
                      <Star size={11} className="text-yellow-400 shrink-0" fill="currentColor" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 rounded-full bg-white/10">
                      <div
                        className={`h-1 rounded-full bg-gradient-to-r ${CATEGORY_COLORS[category] || CATEGORY_COLORS.other}`}
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/40 shrink-0">{skill.proficiency}%</span>
                  </div>
                  <p className="text-xs text-white/30 mt-0.5 capitalize">{skill.skill_level} · {skill.years_of_experience}y</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <SkillFeaturedToggle id={skill.id} featured={skill.featured ?? false} />
                  <a
                    href={`/admin/skills/${skill.id}/edit`}
                    className="p-1.5 rounded-lg text-white/40 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                    aria-label="Edit skill"
                  >
                    <Pencil size={13} />
                  </a>
                  <DeleteButton id={skill.id} action={deleteSkillAction} label="skill" size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
