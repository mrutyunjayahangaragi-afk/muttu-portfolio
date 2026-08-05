import type { Metadata } from "next"
import { Plus, Pencil, ExternalLink, Star, Globe, EyeOff } from "lucide-react"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { DeleteButton } from "@/features/admin/delete-button"
import { ProjectPublishToggle } from "@/features/admin/project-publish-toggle"
import { ProjectFeaturedToggle } from "@/features/admin/project-featured-toggle"
import { deleteProjectAction } from "./project-actions"
import { formatDate } from "@/lib/utils"
import type { Project } from "@/types"

export const metadata: Metadata = {
  title: "Projects — Admin",
  robots: { index: false, follow: false },
}

const CATEGORY_COLORS: Record<string, string> = {
  web:         "from-blue-500 to-cyan-500",
  ai:          "from-purple-500 to-pink-500",
  ml:          "from-violet-500 to-purple-500",
  mobile:      "from-green-500 to-emerald-500",
  backend:     "from-orange-500 to-amber-500",
  fullstack:   "from-indigo-500 to-blue-500",
  hackathon:   "from-red-500 to-orange-500",
  open_source: "from-teal-500 to-cyan-500",
  other:       "from-gray-500 to-slate-500",
}

export default async function AdminProjectsPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })

  const published = projects?.filter((p) => p.published).length ?? 0
  const featured  = projects?.filter((p) => p.featured).length ?? 0

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description={`${projects?.length ?? 0} total · ${published} published · ${featured} featured`}
      >
        <a
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New Project
        </a>
      </AdminPageHeader>

      <div className="space-y-3">
        {!projects?.length && (
          <div className="glass rounded-2xl p-12 text-center text-white/40">
            No projects yet. Click "New Project" to add one.
          </div>
        )}

        {projects?.map((project) => (
          <div
            key={project.id}
            className="glass rounded-2xl p-4 flex items-center gap-4 border border-white/10 hover:border-white/20 transition-colors"
          >
            {/* Thumb */}
            <div className={`w-14 h-10 rounded-xl shrink-0 overflow-hidden bg-gradient-to-br ${CATEGORY_COLORS[project.category] || CATEGORY_COLORS.other} flex items-center justify-center`}>
              {(project.cover_image || project.image_url) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.cover_image || project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg">🚀</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium text-white truncate">{project.title}</span>
                {project.featured && <Star size={11} className="text-yellow-400 shrink-0" fill="currentColor" />}
                {!project.published && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/35">Draft</span>}
              </div>
              <div className="flex items-center gap-3 text-xs text-white/40">
                <span className="capitalize">{project.category.replace("_", " ")}</span>
                <span>·</span>
                <span className="capitalize">{project.status?.replace("_", " ")}</span>
                <span>·</span>
                <span>{formatDate(project.created_at, { month: "short", year: "numeric" })}</span>
              </div>
            </div>

            {/* Tech pills */}
            <div className="hidden lg:flex items-center gap-1.5 shrink-0">
              {(project.tech_stack ?? []).slice(0, 3).map((tech: string) => (
                <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/45">
                  {tech}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {(project.live_url || project.live_demo_url) && (
                <a
                  href={project.live_url || project.live_demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="View live"
                >
                  <ExternalLink size={14} />
                </a>
              )}
              <ProjectFeaturedToggle id={project.id} featured={project.featured ?? false} />
              <ProjectPublishToggle id={project.id} published={project.published ?? true} />
              <a
                href={`/admin/projects/${project.id}/edit`}
                className="p-1.5 rounded-lg text-white/40 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                aria-label="Edit"
              >
                <Pencil size={14} />
              </a>
              <DeleteButton id={project.id} action={deleteProjectAction} label="project" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
