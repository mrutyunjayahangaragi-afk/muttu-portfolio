import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { LeadershipForm } from "@/features/admin/leadership-form"
import { updateLeadership } from "../../../actions"
import type { Leadership } from "@/types"

export const metadata: Metadata = {
  title: "Edit Leadership — Admin",
  robots: { index: false, follow: false },
}

interface EditLeadershipPageProps {
  params: Promise<{ id: string }>
}

export default async function EditLeadershipPage({ params }: EditLeadershipPageProps) {
  await requireAdmin()
  const { id } = await params

  const supabase = await createClient()
  const { data: item } = await supabase
    .from("leadership")
    .select("*")
    .eq("id", id)
    .single()

  if (!item) notFound()

  async function handleUpdate(formData: FormData) {
    "use server"
    return await updateLeadership(id, { success: false, error: "" }, formData)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title={`Edit ${item.title}`} description={item.organization} />
      <LeadershipForm leadership={item as Leadership} onSubmit={handleUpdate} />
    </div>
  )
}
