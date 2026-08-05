import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { getBackupsData } from "@/services/system"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { BackupsManager } from "@/features/admin/backups-manager"

export const metadata: Metadata = {
  title: "Backup & Restore — Admin",
  robots: { index: false, follow: false },
}

export default async function BackupsPage() {
  await requireAdmin()
  const { backups, mediaSummary } = await getBackupsData()

  return (
    <div className="space-y-6 pb-12">
      <AdminPageHeader
        title="Database Backup &amp; Restore"
        description="Create point-in-time database snapshots, verify data integrity, and inspect media storage."
      />
      <BackupsManager backups={backups} mediaSummary={mediaSummary} />
    </div>
  )
}
