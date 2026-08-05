import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { JourneyMilestonesManager } from "@/features/admin/journey-milestones-manager"
import type { JourneyMilestone } from "@/types/about"

export const metadata: Metadata = {
  title: "Journey Milestones — Admin",
  robots: { index: false, follow: false },
}

export default async function AdminJourneyPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: milestones } = await supabase
    .from("journey_milestones")
    .select("*")
    .order("order", { ascending: true })

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Journey & Learning Timeline"
        description="Add, edit, reorder, or delete key milestones that outline your learning path and career progression."
      />
      <JourneyMilestonesManager initialMilestones={(milestones as JourneyMilestone[]) || []} />
    </div>
  )
}
