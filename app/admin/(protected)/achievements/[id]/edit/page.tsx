import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { AchievementForm } from "@/features/admin/achievement-form"
import { updateAchievement } from "../../../actions"
import type { Achievement } from "@/types"

export const metadata: Metadata = {
  title: "Edit Achievement — Admin",
  robots: { index: false, follow: false },
}

interface EditAchievementPageProps {
  params: Promise<{ id: string }>
}

export default async function EditAchievementPage({ params }: EditAchievementPageProps) {
  await requireAdmin()
  const { id } = await params

  const supabase = await createClient()
  const { data: item } = await supabase
    .from("achievements")
    .select("*")
    .eq("id", id)
    .single()

  if (!item) notFound()

  async function handleUpdate(formData: FormData) {
    "use server"
    return await updateAchievement(id, { success: false, error: "" }, formData)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title={`Edit ${item.title}`} description={item.organization ?? "Achievement"} />
      <AchievementForm achievement={item as Achievement} onSubmit={handleUpdate} />
    </div>
  )
}
