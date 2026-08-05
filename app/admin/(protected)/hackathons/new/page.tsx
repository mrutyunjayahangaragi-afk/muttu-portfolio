import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { HackathonForm } from "@/features/admin/hackathon-form"
import { createHackathon } from "../../actions"

export const metadata: Metadata = {
  title: "Add Hackathon — Admin",
  robots: { index: false, follow: false },
}

export default async function NewHackathonPage() {
  await requireAdmin()

  async function handleCreate(formData: FormData) {
    "use server"
    return await createHackathon({ success: false, error: "" }, formData)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Add Hackathon" description="Add a new hackathon project or achievement" />
      <HackathonForm onSubmit={handleCreate} />
    </div>
  )
}
