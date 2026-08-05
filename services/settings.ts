import { createStaticClient } from "@/lib/supabase/server"
import type { Settings, SocialLink, Resume } from "@/types"
import { unstable_cache } from "next/cache"

async function fetchSettings(): Promise<Settings | null> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .single()

  if (error || !data) return null
  return data
}

export const getCachedSettings = unstable_cache(
  async () => fetchSettings(),
  ["global-settings"],
  { revalidate: 3600, tags: ["settings"] }
)

export async function getSettings(): Promise<Settings | null> {
  return getCachedSettings()
}

async function fetchSocialLinks(): Promise<SocialLink[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true })

  if (error) return []
  return data
}

export const getCachedSocialLinks = unstable_cache(
  async () => fetchSocialLinks(),
  ["global-social-links"],
  { revalidate: 3600, tags: ["social_links"] }
)

export async function getSocialLinks(): Promise<SocialLink[]> {
  return getCachedSocialLinks()
}

async function fetchLatestResume(): Promise<Resume | null> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return null
  return data
}

export const getCachedLatestResume = unstable_cache(
  async () => fetchLatestResume(),
  ["latest-resume"],
  { revalidate: 3600, tags: ["resumes"] }
)

export async function getLatestResume(): Promise<Resume | null> {
  return getCachedLatestResume()
}
