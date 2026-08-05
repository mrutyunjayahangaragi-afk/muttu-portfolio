import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { VolunteeringForm } from "@/features/admin/volunteering-form"
import { createVolunteering } from "../../actions"

export const metadata: Metadata = {
  title: "Add Volunteering — Admin",
  robots: { index: false, follow: false },
}

export default async function NewVolunteeringPage() {
  await requireAdmin()

  async function handleCreate(formData: FormData) {
    "use server"
    return await createVolunteering({ success: false, error: "" }, formData)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Add Volunteering" description="Add community service or volunteer work" />
      <VolunteeringForm onSubmit={handleCreate} />
    </div>
  )
}
