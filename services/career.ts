import "server-only"

import { createStaticClient } from "@/lib/supabase/server"
import type {
  Experience,
  Education,
  Achievement,
  Certificate,
  Hackathon,
  HackathonGalleryItem,
  Leadership,
  Volunteering,
} from "@/types"
import { unstable_cache } from "next/cache"

// ─── Experience ───────────────────────────────────────────────────────────────

async function fetchExperience(): Promise<Experience[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("display_order", { ascending: true })
    .order("start_date", { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Experience[]
}

export const getExperience = unstable_cache(
  async () => fetchExperience(),
  ["all-experience-data"],
  { revalidate: 3600, tags: ["career"] }
)

// ─── Education ────────────────────────────────────────────────────────────────

async function fetchEducation(): Promise<Education[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("display_order", { ascending: true })
    .order("start_date", { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Education[]
}

export const getEducation = unstable_cache(
  async () => fetchEducation(),
  ["all-education-data"],
  { revalidate: 3600, tags: ["career"] }
)

// ─── Achievements ─────────────────────────────────────────────────────────────

async function fetchAchievements(): Promise<Achievement[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("display_order", { ascending: true })
    .order("award_date", { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Achievement[]
}

export const getAchievements = unstable_cache(
  async () => fetchAchievements(),
  ["all-achievements-data"],
  { revalidate: 3600, tags: ["career"] }
)

export async function getFeaturedAchievements(limit = 4): Promise<Achievement[]> {
  const all = await getAchievements()
  return all.filter((a) => a.featured).slice(0, limit)
}

// ─── Certificates ─────────────────────────────────────────────────────────────

async function fetchCertificates(): Promise<Certificate[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .order("display_order", { ascending: true })
    .order("issue_date", { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Certificate[]
}

export const getCertificates = unstable_cache(
  async () => fetchCertificates(),
  ["all-certificates-data"],
  { revalidate: 3600, tags: ["career"] }
)

export async function getFeaturedCertificates(limit = 6): Promise<Certificate[]> {
  const all = await getCertificates()
  return all.filter((c) => c.featured).slice(0, limit)
}

export async function getCertificateBySlug(slug: string): Promise<Certificate | null> {
  const all = await getCertificates()
  return all.find((c) => c.slug === slug) ?? null
}

export async function getCertificateSlugs(): Promise<string[]> {
  const certs = await getCertificates()
  return certs.map((c) => c.slug).filter(Boolean) as string[]
}

// ─── Hackathons ───────────────────────────────────────────────────────────────

async function fetchHackathons(): Promise<Hackathon[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("hackathons")
    .select("*")
    .order("display_order", { ascending: true })
    .order("date", { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Hackathon[]
}

export const getHackathons = unstable_cache(
  async () => fetchHackathons(),
  ["all-hackathons-data"],
  { revalidate: 3600, tags: ["career"] }
)

export async function getFeaturedHackathons(limit = 3): Promise<Hackathon[]> {
  const all = await getHackathons()
  return all.filter((h) => h.featured).slice(0, limit)
}

export async function getHackathonGallery(hackathonId: string): Promise<HackathonGalleryItem[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("hackathon_gallery")
    .select("*")
    .eq("hackathon_id", hackathonId)
    .order("image_order", { ascending: true })

  if (error) return []
  return (data ?? []) as HackathonGalleryItem[]
}

export async function getHackathonBySlug(slug: string): Promise<Hackathon | null> {
  const all = await getHackathons()
  const hackathon = all.find((h) => h.slug === slug) ?? null
  if (!hackathon) return null

  const galleryItems = await getHackathonGallery(hackathon.id)
  return {
    ...hackathon,
    gallery_items: galleryItems,
  }
}

export async function getHackathonSlugs(): Promise<string[]> {
  const h = await getHackathons()
  return h.map((item) => item.slug).filter(Boolean) as string[]
}

// ─── Leadership ───────────────────────────────────────────────────────────────

async function fetchLeadership(): Promise<Leadership[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("leadership")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as Leadership[]
}

export const getLeadership = unstable_cache(
  async () => fetchLeadership(),
  ["all-leadership-data"],
  { revalidate: 3600, tags: ["career"] }
)

// ─── Volunteering ─────────────────────────────────────────────────────────────

async function fetchVolunteering(): Promise<Volunteering[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("volunteering")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as Volunteering[]
}

export const getVolunteering = unstable_cache(
  async () => fetchVolunteering(),
  ["all-volunteering-data"],
  { revalidate: 3600, tags: ["career"] }
)

// ─── Career Stats ─────────────────────────────────────────────────────────────

export async function getCareerStats() {
  const [certs, hackathons, achievements, experience, leadership, education] =
    await Promise.all([
      getCertificates(),
      getHackathons(),
      getAchievements(),
      getExperience(),
      getLeadership(),
      getEducation(),
    ])

  const earliestEdu = education[education.length - 1]?.start_date
  const yearsLearning = earliestEdu
    ? new Date().getFullYear() - new Date(earliestEdu).getFullYear()
    : 0

  return {
    certificates: certs.length,
    hackathons: hackathons.length,
    achievements: achievements.length,
    experience: experience.length,
    leadership: leadership.length,
    yearsLearning,
  }
}
