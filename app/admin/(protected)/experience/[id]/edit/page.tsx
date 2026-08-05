import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { ExperienceForm } from "@/features/admin/experience-form"
import { updateExperience } from "../../../actions"
import type { Experience } from "@/types"

export const metadata: Metadata = {
  title: "Edit Experience — Admin",
  robots: { index: false, follow: false },
}

interface EditExperiencePageProps {
  params: Promise<{ id: string }>
}

export default async function EditExperiencePage({ params }: EditExperiencePageProps) {
  await requireAdmin()
  const { id } = await params

  const supabase = await createClient()
  const { data: item } = await supabase
    .from("experience")
    .select("*")
    .eq("id", id)
    .single()

  if (!item) notFound()

  async function handleUpdate(formData: FormData) {
    "use server"
    return await updateExperience(id, { success: false, error: "" }, formData)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title={`Edit ${item.role}`} description={item.company} />
      <ExperienceForm experience={item as Experience} onSubmit={handleUpdate} />
    </div>
  )
}
