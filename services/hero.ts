import "server-only"

import { createStaticClient } from "@/lib/supabase/server"
import type { HeroProfile, HeroStat, Hero3DConfig, Hero3DContent } from "@/types/hero"
import { unstable_cache } from "next/cache"

async function fetchHeroProfile(): Promise<HeroProfile | null> {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from("hero_profile")
    .select("*")
    .limit(1)
    .single()
  return data as HeroProfile | null
}

export const getHeroProfile = unstable_cache(
  async () => fetchHeroProfile(),
  ["hero-profile-data"],
  { revalidate: 3600, tags: ["hero"] }
)

async function fetchHeroStats(): Promise<HeroStat[]> {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from("hero_stats")
    .select("*")
    .order("order", { ascending: true })
  return (data ?? []) as HeroStat[]
}

export const getHeroStats = unstable_cache(
  async () => fetchHeroStats(),
  ["hero-stats-data"],
  { revalidate: 3600, tags: ["hero"] }
)

// ─── Hero 3D Config & Content ──────────────────────────────────────────────────

export const DEFAULT_HERO_3D_CONFIG: Hero3DConfig = {
  id: "00000000-0000-0000-0002-000000000001",
  show_laptop: true,
  show_ai_globe: true,
  show_project_cards: true,
  show_certificate_card: true,
  show_hackathon_badge: true,
  show_trophy: true,
  show_github_cube: true,
  show_tech_icons: true,
  show_particles: true,
  custom_glb_url: null,
  hdr_environment_url: null,
  environment_preset: "night",
  background_color: "#020408",
  ambient_light_intensity: 0.4,
  directional_light_color: "#ffffff",
  directional_light_intensity: 1.5,
  point_light_color: "#a855f7",
  point_light_intensity: 1.0,
  spot_light_color: "#60a5fa",
  camera_position_x: 0,
  camera_position_y: 0,
  camera_position_z: 9,
  floating_speed: 1.0,
  mouse_sensitivity: 1.0,
  orbit_auto_rotate: true,
  orbit_rotation_speed: 0.5,
  particle_count: 300,
  updated_at: new Date().toISOString(),
}

async function fetchHero3DConfig(): Promise<Hero3DConfig> {
  try {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from("hero_3d_config")
      .select("*")
      .limit(1)
      .single()

    if (!error && data) {
      return { ...DEFAULT_HERO_3D_CONFIG, ...data }
    }
  } catch (err) {
    // Ignore schema errors
  }

  return DEFAULT_HERO_3D_CONFIG
}

export const getHero3DConfig = unstable_cache(
  async () => fetchHero3DConfig(),
  ["hero-3d-config-data"],
  { revalidate: 3600, tags: ["hero", "hero_3d"] }
)

async function fetchHero3DContent(): Promise<Hero3DContent> {
  const supabase = createStaticClient()

  try {
    const [projectRes, certRes, hackathonRes, achievementRes] = await Promise.all([
      supabase.from("projects").select("title, cover_image, image_url, tech_stack").eq("published", true).order("display_order").limit(1).single(),
      supabase.from("certificates").select("title, issuer").order("display_order").limit(1).single(),
      supabase.from("hackathons").select("name, ranking, position, prize").order("display_order").limit(1).single(),
      supabase.from("achievements").select("title").order("display_order").limit(1).single(),
    ])

    const proj = projectRes.data
    const cert = certRes.data
    const hack = hackathonRes.data
    const ach = achievementRes.data

    return {
      latestProjectTitle: proj?.title || "Next.js AI Platform",
      latestProjectImage: proj?.cover_image || proj?.image_url || null,
      latestProjectTech: proj?.tech_stack || ["Next.js", "TypeScript", "AI"],
      latestCertificateTitle: cert?.title || "AWS Solutions Architect",
      latestCertificateIssuer: cert?.issuer || "Amazon Web Services",
      latestHackathonTitle: hack?.name || "Global AI Hackathon",
      latestHackathonAward: hack?.ranking || hack?.position || hack?.prize || "1st Place Winner",
      latestAchievementTitle: ach?.title || "Best Innovation Award",
    }
  } catch (err) {
    return {
      latestProjectTitle: "Next.js AI Platform",
      latestProjectImage: null,
      latestProjectTech: ["Next.js", "TypeScript", "AI"],
      latestCertificateTitle: "AWS Solutions Architect",
      latestCertificateIssuer: "Amazon Web Services",
      latestHackathonTitle: "Global AI Hackathon",
      latestHackathonAward: "1st Place Winner",
      latestAchievementTitle: "Best Innovation Award",
    }
  }
}

export const getHero3DContent = unstable_cache(
  async () => fetchHero3DContent(),
  ["hero-3d-content-bindings"],
  { revalidate: 3600, tags: ["hero", "projects", "certificates", "hackathons", "achievements"] }
)
