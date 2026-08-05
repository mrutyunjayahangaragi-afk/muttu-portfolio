import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { getThemeConfigData } from "@/services/system"
import { AdminPageHeader } from "@/features/admin/admin-page-header"
import { ThemeManager } from "@/features/admin/theme-manager"

export const metadata: Metadata = {
  title: "Theme & Branding — Admin",
  robots: { index: false, follow: false },
}

export default async function ThemePage() {
  await requireAdmin()
  const config = await getThemeConfigData()

  return (
    <div className="space-y-6 pb-12">
      <AdminPageHeader
        title="Theme &amp; Branding Customizer"
        description="Customize your site colors, logo, typography, and card aesthetics with live interactive preview."
      />
      <ThemeManager initialConfig={config} />
    </div>
  )
}
