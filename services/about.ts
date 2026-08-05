import "server-only"

import { createStaticClient } from "@/lib/supabase/server"
import type {
  AboutProfile,
  AboutStat,
  JourneyMilestone,
  CoreValue,
  FunFact,
} from "@/types/about"
import type { Education } from "@/types"
import { unstable_cache } from "next/cache"

async function fetchAboutData() {
  const supabase = createStaticClient()

  const [profile, stats, milestones, education, coreValues, funFacts] =
    await Promise.all([
      supabase
        .from("about_profile")
        .select("*")
        .limit(1)
        .single()
        .then((r) => r.data as AboutProfile | null),

      supabase
        .from("about_stats")
        .select("*")
        .order("order", { ascending: true })
        .then((r) => (r.data as AboutStat[]) ?? []),

      supabase
        .from("journey_milestones")
        .select("*")
        .order("order", { ascending: true })
        .then((r) => (r.data as JourneyMilestone[]) ?? []),

      supabase
        .from("education")
        .select("*")
        .order("start_date", { ascending: true })
        .then((r) => (r.data as Education[]) ?? []),

      supabase
        .from("core_values")
        .select("*")
        .order("order", { ascending: true })
        .then((r) => (r.data as CoreValue[]) ?? []),

      supabase
        .from("fun_facts")
        .select("*")
        .order("order", { ascending: true })
        .then((r) => (r.data as FunFact[]) ?? []),
    ])

  return { profile, stats, milestones, education, coreValues, funFacts }
}

export const getAboutData = unstable_cache(
  async () => fetchAboutData(),
  ["about-section-data"],
  { revalidate: 3600, tags: ["about"] }
)

export async function getAboutProfile(): Promise<AboutProfile | null> {
  const data = await getAboutData()
  return data.profile
}

export async function getJourneyMilestones(): Promise<JourneyMilestone[]> {
  const data = await getAboutData()
  return data.milestones
}

