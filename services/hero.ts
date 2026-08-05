import "server-only"

import { createStaticClient } from "@/lib/supabase/server"
import type { HeroProfile, HeroStat } from "@/types/hero"
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
