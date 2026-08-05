import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { getHero3DConfig } from "@/services/hero"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { Hero3DAdminForm } from "@/features/admin/hero-3d-admin-form"

export const metadata: Metadata = {
  title: "Hero 3D Manager — Admin",
  robots: { index: false, follow: false },
}

export default async function AdminHero3DPage() {
  await requireAdmin()
  const config = await getHero3DConfig()

  return (
    <div>
      <AdminPageHeader
        title="Hero 3D Manager"
        description="Configure your interactive 3D Developer Workspace, model visibility, lighting, colors, camera position, particles, and motion sensitivity."
      />
      <Hero3DAdminForm config={config} />
    </div>
  )
}
