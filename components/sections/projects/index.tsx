/**
 * components/sections/projects/index.tsx
 *
 * Homepage #projects section — Server Component.
 * Shows a featured carousel + first 6 projects with a "View All" CTA.
 */
import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getProjects, getFeaturedProjects, getProjectStats } from "@/services/projects"
import { ProjectCard } from "./project-card"
import { ProjectsStatsBanner } from "./projects-stats-banner"
import { EmptyState } from "@/components/ui/empty-state"

function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-64 bg-white/5 rounded-2xl" />
      ))}
    </div>
  )
}

async function ProjectsData() {
  const [projects, featured, stats] = await Promise.all([
    getProjects(),
    getFeaturedProjects(),
    getProjectStats(),
  ])

  if (projects.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon="projects"
          title="No projects available yet"
          description="Every project showcased on this site is dynamically fetched from the database. Currently, there are no items to display."
        />
      </div>
    )
  }

  const preview = projects.slice(0, 6)

  return (
    <>
      <ProjectsStatsBanner stats={stats} />

      {/* Featured heading */}
      {featured.length > 0 && (
        <div className="mb-10">
          <h3 className="text-sm font-mono text-yellow-400 uppercase tracking-widest mb-6">
            ⭐ Featured Projects
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.slice(0, 3).map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} variant="featured" />
            ))}
          </div>
        </div>
      )}

      {/* All projects preview */}
      <div className="mb-10">
        <h3 className="text-sm font-mono text-white/40 uppercase tracking-widest mb-6">
          All Projects
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {preview.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>

      {/* View all CTA */}
      {projects.length > 6 && (
        <div className="text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
          >
            View All {projects.length} Projects
            <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </>
  )
}

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative bg-[#020408] overflow-hidden py-24"
      aria-label="Projects and portfolio"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full opacity-[0.06] blur-[120px]"
          style={{ background: "radial-gradient(ellipse, #3b82f6, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] rounded-full opacity-[0.06] blur-[100px]"
          style={{ background: "radial-gradient(ellipse, #a855f7, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-3">My Work</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Featured{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className="text-white/55 mt-3 max-w-lg">
              A selection of real-world applications I&apos;ve designed, built, and shipped.
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden md:flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <Suspense fallback={<ProjectsSkeleton />}>
          <ProjectsData />
        </Suspense>
      </div>
    </section>
  )
}
