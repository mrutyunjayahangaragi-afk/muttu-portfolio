"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, AlertCircle, CheckCircle2, Globe, Palette, Key, MapPin } from "lucide-react"
import type { Settings } from "@/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface SettingsManagerProps {
  initialSettings: Settings | null
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    site_name: initialSettings?.site_name || "My Portfolio",
    site_description: initialSettings?.site_description || "",
    seo_keywords: initialSettings?.seo_keywords?.join(", ") || "",
    theme_color: initialSettings?.theme_color || "#000000",
    accent_color: initialSettings?.accent_color || "#3b82f6",
    openrouter_api_key: initialSettings?.openrouter_api_key || "",
    contact_email: initialSettings?.contact_email || "",
    contact_phone: initialSettings?.contact_phone || "",
    contact_location: initialSettings?.contact_location || "",
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      
      const payload = {
        site_name: formData.site_name,
        site_description: formData.site_description,
        seo_keywords: formData.seo_keywords.split(",").map(k => k.trim()).filter(Boolean),
        theme_color: formData.theme_color,
        accent_color: formData.accent_color,
        openrouter_api_key: formData.openrouter_api_key,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        contact_location: formData.contact_location,
        updated_at: new Date().toISOString(),
      }

      if (initialSettings?.id) {
        const { error: updateError } = await supabase
          .from("settings")
          .update(payload)
          .eq("id", initialSettings.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from("settings")
          .insert(payload)
        if (insertError) throw insertError
      }

      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <CheckCircle2 size={16} />
          Settings saved successfully!
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Site Identity */}
        <div className="glass rounded-3xl border border-white/10 p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
            <Globe className="text-blue-400" />
            <h2 className="text-xl font-bold text-white">Site Identity & SEO</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Site Name</label>
              <input
                type="text"
                value={formData.site_name}
                onChange={(e) => setFormData(f => ({ ...f, site_name: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Site Description</label>
              <textarea
                value={formData.site_description}
                onChange={(e) => setFormData(f => ({ ...f, site_description: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">SEO Keywords (comma separated)</label>
              <input
                type="text"
                value={formData.seo_keywords}
                onChange={(e) => setFormData(f => ({ ...f, seo_keywords: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
                placeholder="portfolio, developer, react"
              />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="glass rounded-3xl border border-white/10 p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
            <MapPin className="text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Contact Information</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Email Address</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData(f => ({ ...f, contact_email: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Phone Number</label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => setFormData(f => ({ ...f, contact_phone: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Location</label>
              <input
                type="text"
                value={formData.contact_location}
                onChange={(e) => setFormData(f => ({ ...f, contact_location: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
                placeholder="San Francisco, CA"
              />
            </div>
          </div>
        </div>

        {/* AI Configuration */}
        <div className="glass rounded-3xl border border-white/10 p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
            <Key className="text-purple-400" />
            <h2 className="text-xl font-bold text-white">AI Configuration</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">OpenRouter API Key</label>
              <input
                type="password"
                value={formData.openrouter_api_key}
                onChange={(e) => setFormData(f => ({ ...f, openrouter_api_key: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500/50"
                placeholder="sk-or-v1-..."
              />
              <p className="text-xs text-white/40">Used for the portfolio AI assistant.</p>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="glass rounded-3xl border border-white/10 p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
            <Palette className="text-rose-400" />
            <h2 className="text-xl font-bold text-white">Theme Colors</h2>
          </div>
          
          <div className="flex gap-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Background</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.theme_color}
                  onChange={(e) => setFormData(f => ({ ...f, theme_color: e.target.value }))}
                  className="h-10 w-10 cursor-pointer rounded bg-transparent"
                />
                <span className="text-sm font-mono text-white/50">{formData.theme_color}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Accent</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.accent_color}
                  onChange={(e) => setFormData(f => ({ ...f, accent_color: e.target.value }))}
                  className="h-10 w-10 cursor-pointer rounded bg-transparent"
                />
                <span className="text-sm font-mono text-white/50">{formData.accent_color}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={16} />
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  )
}
