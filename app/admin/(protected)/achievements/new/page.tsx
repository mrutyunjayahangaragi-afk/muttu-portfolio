import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { AchievementForm } from "@/features/admin/achievement-form"
import { createAchievement } from "../../actions"

export const metadata: Metadata = {
  title: "Add Achievement — Admin",
  robots: { index: false, follow: false },
}

export default async function NewAchievementPage() {
  await requireAdmin()

  async function handleCreate(formData: FormData) {
    "use server"
    return await createAchievement({ success: false, error: "" }, formData)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Add Achievement" description="Add an honor, award, or milestone" />
      <AchievementForm onSubmit={handleCreate} />
    </div>
  )
}
