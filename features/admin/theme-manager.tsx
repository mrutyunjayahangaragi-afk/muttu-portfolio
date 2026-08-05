"use client"

import { useState, useActionState } from "react"
import { Paintbrush, Save, Sparkles, Check, Image as ImageIcon, Layout, Palette, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateThemeConfig } from "@/app/admin/(protected)/actions"
import type { ThemeConfigData } from "@/services/system"

interface ThemeManagerProps {
  initialConfig: ThemeConfigData
}

export function ThemeManager({ initialConfig }: ThemeManagerProps) {
  const [state, formAction, isPending] = useActionState(updateThemeConfig, { success: false, error: "" })

  const [siteName, setSiteName] = useState(initialConfig.site_name)
  const [logoText, setLogoText] = useState(initialConfig.logo_text || "<Dev/>")
  const [primaryColor, setPrimaryColor] = useState(initialConfig.primary_color)
  const [secondaryColor, setSecondaryColor] = useState(initialConfig.secondary_color)
  const [accentColor, setAccentColor] = useState(initialConfig.accent_color)
  const [fontHeading, setFontHeading] = useState(initialConfig.font_heading)
  const [borderRadius, setBorderRadius] = useState(initialConfig.border_radius)
  const [mode, setMode] = useState(initialConfig.mode)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Form Settings */}
      <form action={formAction} className="lg:col-span-2 space-y-6">
        {state.error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400 font-medium">
            {state.error}
          </div>
        )}
        {state.success && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-400 font-medium flex items-center gap-2">
            <Check size={16} /> Theme &amp; branding preferences updated successfully!
          </div>
        )}

        {/* Branding Section */}
        <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ImageIcon size={16} className="text-blue-400" />
            Site Branding &amp; Logo Text
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/60 font-medium">Site Name</label>
              <input
                type="text"
                name="site_name"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-blue-500/50 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs text-white/60 font-medium">Navbar Brand / Logo Text</label>
              <input
                type="text"
                name="logo_text"
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                placeholder="e.g. <Dev/> or <John/>"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-mono text-white focus:border-blue-500/50 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Colors Section */}
        <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Palette size={16} className="text-purple-400" />
            Color Palette Customizer
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-white/60 font-medium">Primary Accent Color</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  name="primary_color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/60 font-medium">Secondary Color</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  name="secondary_color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/60 font-medium">Highlight / Success</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  name="accent_color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography & Layout */}
        <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Layout size={16} className="text-emerald-400" />
            Typography &amp; Layout Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-white/60 font-medium">Heading Font Family</label>
              <select
                name="font_heading"
                value={fontHeading}
                onChange={(e) => setFontHeading(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Inter">Inter (Clean Modern)</option>
                <option value="Outfit">Outfit (Geometric Tech)</option>
                <option value="Roboto">Roboto (Classic Sans)</option>
                <option value="JetBrains Mono">JetBrains Mono (Code)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-white/60 font-medium">Border Radius</label>
              <select
                name="border_radius"
                value={borderRadius}
                onChange={(e) => setBorderRadius(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="0.5rem">Subtle (8px)</option>
                <option value="1rem">Modern (16px)</option>
                <option value="1.5rem">Pill (24px)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-white/60 font-medium">Theme Mode</label>
              <select
                name="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="dark">Dark Mode (Default)</option>
                <option value="light">Light Mode</option>
                <option value="system">System Preference</option>
                <option value="custom">Custom Theme</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5 shadow-lg shadow-blue-500/20 px-6 py-2.5"
          >
            <Save size={14} />
            {isPending ? "Saving Preferences..." : "Save Theme Preferences"}
          </Button>
        </div>
      </form>

      {/* Live Interactive Preview Box */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono tracking-widest text-white/40 uppercase flex items-center gap-2">
          <Sparkles size={14} className="text-amber-400" />
          Live Interactive Theme Preview
        </h3>

        <div
          className="glass rounded-2xl border p-6 space-y-4 shadow-2xl transition-all duration-300"
          style={{
            borderColor: "rgba(255, 255, 255, 0.15)",
            borderRadius: borderRadius,
          }}
        >
          {/* Header element */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-base font-bold text-transparent font-mono">
              {logoText || "<Dev/>"}
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              Live Demo
            </span>
          </div>

          {/* Card Preview */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            <h4 className="text-xs font-bold" style={{ color: secondaryColor }}>
              Hero Section Preview
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Experience dynamic UI customization in real-time.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: primaryColor }}
              >
                Primary CTA
              </button>
              <button
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10"
              >
                Secondary
              </button>
            </div>
          </div>

          {/* Stats indicator */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 p-3 bg-black/40">
            <span className="text-xs text-white/50">Status Indicator</span>
            <span className="text-xs font-semibold" style={{ color: accentColor }}>
              ● Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
