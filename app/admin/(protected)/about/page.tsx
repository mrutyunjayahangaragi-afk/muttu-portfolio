import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { AboutAdminForm } from "@/features/admin/about-admin-form"
import { AboutStatsManager } from "@/features/admin/about-stats-manager"
import { FunFactsManager } from "@/features/admin/fun-facts-manager"
import { JourneyMilestonesManager } from "@/features/admin/journey-milestones-manager"
import type { AboutProfile, AboutStat, FunFact, JourneyMilestone } from "@/types/about"

export const metadata: Metadata = {
  title: "About — Admin",
  robots: { index: false, follow: false },
}

export default async function AdminAboutPage() {
  await requireAdmin()
  const supabase = await createClient()

  const [{ data: profile }, { data: stats }, { data: funFacts }, { data: milestones }] = await Promise.all([
    supabase.from("about_profile").select("*").limit(1).single(),
    supabase.from("about_stats").select("*").order("order", { ascending: true }),
    supabase.from("fun_facts").select("*").order("order", { ascending: true }),
    supabase.from("journey_milestones").select("*").order("order", { ascending: true }),
  ])

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="About Me"
        description="Edit your bio, availability, metrics, journey milestones, fun facts, and personal info."
      />
      <AboutAdminForm profile={profile as AboutProfile | null} />
      <AboutStatsManager initialStats={(stats as AboutStat[]) || []} />
      <JourneyMilestonesManager initialMilestones={(milestones as JourneyMilestone[]) || []} />
      <FunFactsManager initialFacts={(funFacts as FunFact[]) || []} />
    </div>
  )
}

