import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { EducationForm } from "@/features/admin/education-form"
import { createEducation } from "../../actions"

export const metadata: Metadata = {
  title: "Add Education — Admin",
  robots: { index: false, follow: false },
}

export default async function NewEducationPage() {
  await requireAdmin()

  async function handleCreate(formData: FormData) {
    "use server"
    return await createEducation({ success: false, error: "" }, formData)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Add Education" description="Add an academic degree or institution" />
      <EducationForm onSubmit={handleCreate} />
    </div>
  )
}
