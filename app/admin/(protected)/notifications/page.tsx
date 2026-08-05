import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { getNotificationsData } from "@/services/system"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { NotificationsManager } from "@/features/admin/notifications-manager"

export const metadata: Metadata = {
  title: "Notifications — Admin",
  robots: { index: false, follow: false },
}

export default async function NotificationsPage() {
  await requireAdmin()
  const { notifications, unreadCount } = await getNotificationsData()

  return (
    <div className="space-y-6 pb-12">
      <AdminPageHeader
        title="Notification Center"
        description="Monitor real-time system alerts, error logs, contact messages, and deployment status."
      />
      <NotificationsManager notifications={notifications} unreadCount={unreadCount} />
    </div>
  )
}
