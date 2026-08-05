import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { GalleryUploader } from "@/features/admin/gallery-uploader"
import type { MediaItem } from "@/types"

export const metadata: Metadata = {
  title: "Gallery — Admin",
  robots: { index: false, follow: false },
}

export default async function AdminGalleryPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: media } = await supabase
    .from("media_gallery")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media Gallery"
        description="Upload, copy links, and manage portfolio assets stored on Cloudinary & Supabase."
      />
      <GalleryUploader initialItems={(media as MediaItem[]) || []} />
    </div>
  )
}
