import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { VolunteeringForm } from "@/features/admin/volunteering-form"
import { updateVolunteering } from "../../../actions"
import type { Volunteering } from "@/types"

export const metadata: Metadata = {
  title: "Edit Volunteering — Admin",
  robots: { index: false, follow: false },
}

interface EditVolunteeringPageProps {
  params: Promise<{ id: string }>
}

export default async function EditVolunteeringPage({ params }: EditVolunteeringPageProps) {
  await requireAdmin()
  const { id } = await params

  const supabase = await createClient()
  const { data: item } = await supabase
    .from("volunteering")
    .select("*")
    .eq("id", id)
    .single()

  if (!item) notFound()

  async function handleUpdate(formData: FormData) {
    "use server"
    return await updateVolunteering(id, { success: false, error: "" }, formData)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title={`Edit ${item.title}`} description={item.organization} />
      <VolunteeringForm volunteering={item as Volunteering} onSubmit={handleUpdate} />
    </div>
  )
}
