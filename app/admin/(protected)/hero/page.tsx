import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { HeroAdminForm } from "@/features/admin/hero-admin-form"
import type { HeroProfile, HeroStat } from "@/types/hero"

export const metadata: Metadata = {
  title: "Hero — Admin",
  robots: { index: false, follow: false },
}

export default async function AdminHeroPage() {
  await requireAdmin()
  const supabase = await createClient()

  const [{ data: profile }, { data: stats }] = await Promise.all([
    supabase.from("hero_profile").select("*").limit(1).single(),
    supabase.from("hero_stats").select("*").order("order"),
  ])

  return (
    <div>
      <AdminPageHeader
        title="Hero Section"
        description="Edit your name, roles, tagline, social links, and achievement stats."
      />
      <HeroAdminForm
        profile={profile as HeroProfile | null}
        stats={(stats ?? []) as HeroStat[]}
      />
    </div>
  )
}
