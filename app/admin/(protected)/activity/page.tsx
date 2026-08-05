import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { getActivityLogsData } from "@/services/system"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { ActivityLogsManager } from "@/features/admin/activity-logs-manager"

export const metadata: Metadata = {
  title: "Activity Audit Logs — Admin",
  robots: { index: false, follow: false },
}

export default async function ActivityPage() {
  await requireAdmin()
  const { logs, totalCount } = await getActivityLogsData()

  return (
    <div className="space-y-6 pb-12">
      <AdminPageHeader
        title="Activity Audit Logs"
        description="Track and inspect every owner action, authentication event, and database mutation."
      />
      <ActivityLogsManager initialLogs={logs} totalCount={totalCount} />
    </div>
  )
}
