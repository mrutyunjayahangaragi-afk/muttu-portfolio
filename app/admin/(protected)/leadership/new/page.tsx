import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { LeadershipForm } from "@/features/admin/leadership-form"
import { createLeadership } from "../../actions"

export const metadata: Metadata = {
  title: "Add Leadership — Admin",
  robots: { index: false, follow: false },
}

export default async function NewLeadershipPage() {
  await requireAdmin()

  async function handleCreate(formData: FormData) {
    "use server"
    return await createLeadership({ success: false, error: "" }, formData)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Add Leadership Role" description="Add a club leadership, officer, or community role" />
      <LeadershipForm onSubmit={handleCreate} />
    </div>
  )
}
