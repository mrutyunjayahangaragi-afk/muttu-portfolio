import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { ExperienceForm } from "@/features/admin/experience-form"
import { createExperience } from "../../actions"

export const metadata: Metadata = {
  title: "Add Experience — Admin",
  robots: { index: false, follow: false },
}

export default async function NewExperiencePage() {
  await requireAdmin()

  async function handleCreate(formData: FormData) {
    "use server"
    return await createExperience({ success: false, error: "" }, formData)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Add Experience" description="Add a new position to your career journey" />
      <ExperienceForm onSubmit={handleCreate} />
    </div>
  )
}
