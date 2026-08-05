import "server-only"
import { createStaticClient } from "@/lib/supabase/server"
import { unstable_cache } from "next/cache"

export interface NavDataCounts {
  about: number
  projects: number
  blog: number
  skills: number
  experience: number
  education: number
  certificates: number
  hackathons: number
  achievements: number
  leadership: number
  volunteering: number
  gallery: number
}

async function fetchNavDataCounts(): Promise<NavDataCounts> {
  const supabase = createStaticClient()

  try {
    const [
      aboutRes,
      projectsRes,
      blogRes,
      skillsRes,
      experienceRes,
      educationRes,
      certificatesRes,
      hackathonsRes,
      achievementsRes,
      leadershipRes,
      volunteeringRes,
      galleryRes,
    ] = await Promise.all([
      supabase.from("about_profile").select("id", { count: "exact", head: true }),
      supabase.from("projects").select("id", { count: "exact", head: true }).eq("published", true),
      supabase.from("blogs").select("id", { count: "exact", head: true }).eq("published", true),
      supabase.from("skills").select("id", { count: "exact", head: true }),
      supabase.from("experience").select("id", { count: "exact", head: true }),
      supabase.from("education").select("id", { count: "exact", head: true }),
      supabase.from("certificates").select("id", { count: "exact", head: true }),
      supabase.from("hackathons").select("id", { count: "exact", head: true }),
      supabase.from("achievements").select("id", { count: "exact", head: true }),
      supabase.from("leadership").select("id", { count: "exact", head: true }),
      supabase.from("volunteering").select("id", { count: "exact", head: true }),
      supabase.from("media_gallery").select("id", { count: "exact", head: true }),
    ])

    return {
      about: aboutRes.count ?? 0,
      projects: projectsRes.count ?? 0,
      blog: blogRes.count ?? 0,
      skills: skillsRes.count ?? 0,
      experience: experienceRes.count ?? 0,
      education: educationRes.count ?? 0,
      certificates: certificatesRes.count ?? 0,
      hackathons: hackathonsRes.count ?? 0,
      achievements: achievementsRes.count ?? 0,
      leadership: leadershipRes.count ?? 0,
      volunteering: volunteeringRes.count ?? 0,
      gallery: galleryRes.count ?? 0,
    }
  } catch (error) {
    console.error("Error fetching navigation data counts:", error)
    return {
      about: 1,
      projects: 1,
      blog: 1,
      skills: 1,
      experience: 1,
      education: 1,
      certificates: 1,
      hackathons: 1,
      achievements: 1,
      leadership: 1,
      volunteering: 1,
      gallery: 1,
    }
  }
}

export const getNavDataCounts = unstable_cache(
  async () => fetchNavDataCounts(),
  ["public-nav-counts"],
  { revalidate: 3600, tags: ["navigation", "settings", "projects", "blogs", "skills", "career", "gallery", "about"] }
)
