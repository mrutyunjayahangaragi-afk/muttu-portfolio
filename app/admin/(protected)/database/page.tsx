import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { getDatabaseStatsData } from "@/services/system"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { DatabaseMonitor } from "@/features/admin/database-monitor"

export const metadata: Metadata = {
  title: "Database Manager — Admin",
  robots: { index: false, follow: false },
}

export default async function DatabasePage() {
  await requireAdmin()
  const stats = await getDatabaseStatsData()

  return (
    <div className="space-y-6 pb-12">
      <AdminPageHeader
        title="Database &amp; Storage Monitor"
        description="Monitor live table row counts, RLS security policies, storage buckets, and service health status."
      />
      <DatabaseMonitor stats={stats} />
    </div>
  )
}
