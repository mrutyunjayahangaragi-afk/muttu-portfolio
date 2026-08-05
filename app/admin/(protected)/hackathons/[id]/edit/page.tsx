import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { getHackathonGallery } from "@/services/career"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { HackathonForm } from "@/features/admin/hackathon-form"
import { HackathonGalleryManager } from "@/features/admin/hackathon-gallery-manager"
import { updateHackathon } from "../../../actions"
import type { Hackathon } from "@/types"

export const metadata: Metadata = {
  title: "Edit Hackathon — Admin",
  robots: { index: false, follow: false },
}

interface EditHackathonPageProps {
  params: Promise<{ id: string }>
}

export default async function EditHackathonPage({ params }: EditHackathonPageProps) {
  await requireAdmin()
  const { id } = await params

  const supabase = await createClient()
  const [itemRes, galleryItems] = await Promise.all([
    supabase.from("hackathons").select("*").eq("id", id).single(),
    getHackathonGallery(id),
  ])

  const item = itemRes.data
  if (!item) notFound()

  async function handleUpdate(formData: FormData) {
    "use server"
    return await updateHackathon(id, { success: false, error: "" }, formData)
  }

  return (
    <div className="space-y-8 pb-12">
      <AdminPageHeader title={`Edit ${item.event_name || item.name}`} description={item.organizer} />
      <HackathonForm hackathon={item as Hackathon} onSubmit={handleUpdate} />
      
      {/* Participation Gallery Manager */}
      <HackathonGalleryManager hackathonId={id} initialGallery={galleryItems} />
    </div>
  )
}
