import type { Metadata } from "next"
import { Suspense } from "react"
import { getProjects, getProjectStats } from "@/services/projects"
import { ProjectsContent } from "@/components/sections/projects/projects-content"
import { ProjectsStatsBanner } from "@/components/sections/projects/projects-stats-banner"
import { EmptyState } from "@/components/ui/empty-state"

export const metadata: Metadata = {
  title: "Projects",
  description: "A showcase of my full-stack, AI, and web development projects.",
  openGraph: {
    title: "Projects | Dev Portfolio",
    description: "Explore my portfolio of real-world projects.",
  },
}

export const revalidate = 3600

async function ProjectsData() {
  const [projects, stats] = await Promise.all([
    getProjects().catch(() => []),
    getProjectStats().catch(() => ({ total: 0, featured: 0, technologies: 0, completed: 0 })),
  ])

  if (projects.length === 0) {
    return <EmptyState title="Projects" message="Content will be available soon." />
  }

  return (
    <>
      <ProjectsStatsBanner stats={stats} />
      <ProjectsContent projects={projects} />
    </>
  )
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-72 bg-white/5 rounded-2xl" />
      ))}
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#020408] pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div
          className="absolute top-0 left-1/4 w-[700px] h-[500px] rounded-full opacity-[0.06] blur-[120px]"
          style={{ background: "radial-gradient(ellipse, #3b82f6, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[600px] h-[400px] rounded-full opacity-[0.06] blur-[100px]"
          style={{ background: "radial-gradient(ellipse, #a855f7, transparent 70%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-3">Portfolio</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            My{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h1>
          <p className="text-white/55 max-w-xl mx-auto text-base">
            Real-world applications built with modern technologies — from AI tools to full-stack web apps.
          </p>
        </div>

        <Suspense fallback={<Skeleton />}>
          <ProjectsData />
        </Suspense>
      </div>
    </main>
  )
}
