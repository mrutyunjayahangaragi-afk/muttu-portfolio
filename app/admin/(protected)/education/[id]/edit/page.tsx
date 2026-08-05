import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { EducationForm } from "@/features/admin/education-form"
import { updateEducation } from "../../../actions"
import type { Education } from "@/types"

export const metadata: Metadata = {
  title: "Edit Education — Admin",
  robots: { index: false, follow: false },
}

interface EditEducationPageProps {
  params: Promise<{ id: string }>
}

export default async function EditEducationPage({ params }: EditEducationPageProps) {
  await requireAdmin()
  const { id } = await params

  const supabase = await createClient()
  const { data: item } = await supabase
    .from("education")
    .select("*")
    .eq("id", id)
    .single()

  if (!item) notFound()

  async function handleUpdate(formData: FormData) {
    "use server"
    return await updateEducation(id, { success: false, error: "" }, formData)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title={`Edit ${item.degree}`} description={item.institution} />
      <EducationForm education={item as Education} onSubmit={handleUpdate} />
    </div>
  )
}
