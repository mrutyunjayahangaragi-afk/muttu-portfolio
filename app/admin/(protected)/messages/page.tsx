import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { getContactMessages, getMessageStats, getMessageAnalytics } from "@/services/messages"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { MessagesDashboardClient } from "@/features/admin/messages-dashboard-client"

export const metadata: Metadata = {
  title: "Messages & Lead Management — Admin",
  robots: { index: false, follow: false },
}

export default async function MessagesAdminPage() {
  await requireAdmin()

  const [messages, stats, analytics] = await Promise.all([
    getContactMessages(),
    getMessageStats(),
    getMessageAnalytics(),
  ])

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Messages & Lead Management"
        description="View contact submissions, manage client leads, inspect attachments, track inquiry analytics, and send email replies."
      />
      <MessagesDashboardClient
        initialMessages={messages}
        stats={stats}
        analytics={analytics}
      />
    </div>
  )
}
