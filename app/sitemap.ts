import type { MetadataRoute } from "next"
import { getProjectSlugs } from "@/services/projects"
import { getHackathonSlugs } from "@/services/career"
import { createBrowserClient } from "@supabase/ssr"
import type { Blog } from "@/types"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"

  // Public base routes
  const publicRoutes = [
    "",
    "/about",
    "/projects",
    "/blog",
    "/skills",
    "/experience",
    "/education",
    "/certificates",
    "/hackathons",
    "/achievements",
    "/leadership",
    "/volunteering",
    "/gallery",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }))

  // Dynamic project routes
  let projectRoutes: MetadataRoute.Sitemap = []
  try {
    const projectSlugs = await getProjectSlugs()
    projectRoutes = projectSlugs.map((slug) => ({
      url: `${baseUrl}/projects/${slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  } catch (e) {
    console.error("Failed to generate sitemap for projects:", e)
  }

  // Dynamic hackathon routes
  let hackathonRoutes: MetadataRoute.Sitemap = []
  try {
    const hackathonSlugs = await getHackathonSlugs()
    hackathonRoutes = hackathonSlugs.map((slug) => ({
      url: `${baseUrl}/hackathons/${slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
  } catch (e) {
    console.error("Failed to generate sitemap for hackathons:", e)
  }

  // Dynamic blog routes
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: blogs } = await supabase
      .from("blogs")
      .select("slug, updated_at, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })

    blogRoutes = (blogs ?? []).map((blog: Pick<Blog, "slug" | "updated_at" | "created_at">) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updated_at || blog.created_at).toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  } catch (e) {
    console.error("Failed to generate sitemap for blogs:", e)
  }

  return [
    ...publicRoutes,
    ...projectRoutes,
    ...hackathonRoutes,
    ...blogRoutes,
  ]
}
