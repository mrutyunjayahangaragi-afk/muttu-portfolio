import "server-only"

import { createStaticClient } from "@/lib/supabase/server"
import type { Project, ProjectWithRelations } from "@/types"
import { unstable_cache } from "next/cache"

// ─── Fetch all published projects ─────────────────────────────────────────

async function fetchProjects(): Promise<Project[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("display_order", { ascending: true })
    .order("order", { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as Project[]
}

export const getProjects = unstable_cache(
  async () => fetchProjects(),
  ["all-published-projects"],
  { revalidate: 3600, tags: ["projects"] }
)

// ─── Featured projects ────────────────────────────────────────────────────

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getProjects()
  return all.filter((p) => p.featured)
}

// ─── Single project with all relations ───────────────────────────────────

export async function getProjectBySlug(
  slug: string
): Promise<ProjectWithRelations | null> {
  const supabase = createStaticClient()

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (error || !project) return null

  // Fetch related data in parallel
  const [gallery, videos, features, timeline] = await Promise.all([
    supabase
      .from("project_gallery")
      .select("*")
      .eq("project_id", project.id)
      .order("display_order"),
    supabase
      .from("project_videos")
      .select("*")
      .eq("project_id", project.id),
    supabase
      .from("project_features")
      .select("*")
      .eq("project_id", project.id)
      .order("display_order"),
    supabase
      .from("project_timeline")
      .select("*")
      .eq("project_id", project.id)
      .order("display_order"),
  ])

  return {
    ...(project as Project),
    gallery: gallery.data ?? [],
    videos: videos.data ?? [],
    features: features.data ?? [],
    timeline: timeline.data ?? [],
  }
}

// ─── Related projects ─────────────────────────────────────────────────────

export async function getRelatedProjects(
  projectId: string,
  category: string,
  limit = 3
): Promise<Project[]> {
  const all = await getProjects()
  return all
    .filter((p) => p.category === category && p.id !== projectId)
    .slice(0, limit)
}

// ─── Slugs for static generation / sitemap ────────────────────────────────

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getProjects()
  return projects.map((p) => p.slug)
}

// ─── Stats ────────────────────────────────────────────────────────────────

export async function getProjectStats() {
  const published = await getProjects()
  const featured = published.filter((p) => p.featured).length
  const techs = new Set(published.flatMap((p) => p.tech_stack ?? []))

  return {
    total: published.length,
    featured,
    technologies: techs.size,
    completed: published.filter((p) => p.status === "completed").length,
  }
}
