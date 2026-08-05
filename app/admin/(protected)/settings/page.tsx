import { Metadata } from "next"
import { getCachedSettings } from "@/services/settings"
import { SettingsManager } from "@/features/admin/settings-manager"

export const metadata: Metadata = {
  title: "Settings | Admin Dashboard",
}

export default async function SettingsAdminPage() {
  const settings = await getCachedSettings()

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Global Settings</h1>
        <p className="mt-2 text-white/50">Manage site metadata, SEO, and integrations.</p>
      </div>

      <SettingsManager initialSettings={settings} />
    </div>
  )
}
