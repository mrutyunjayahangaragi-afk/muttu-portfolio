"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Box, Sun, Camera, Sparkles, Sliders, Save, RefreshCw, CheckCircle2 } from "lucide-react"
import { updateHero3DConfigAction } from "@/app/admin/(protected)/hero-3d/hero-3d-actions"
import type { Hero3DConfig } from "@/types/hero"

interface Hero3DAdminFormProps {
  config: Hero3DConfig
}

export function Hero3DAdminForm({ config }: Hero3DAdminFormProps) {
  const [formData, setFormData] = useState<Hero3DConfig>(config)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [activeTab, setActiveTab] = useState<"toggles" | "assets" | "lighting" | "camera">("toggles")

  const handleToggle = (key: keyof Hero3DConfig) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleChange = (key: keyof Hero3DConfig, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setStatus(null)

    const res = await updateHero3DConfigAction(formData as unknown as Record<string, unknown>)
    setSaving(false)

    if (res.success) {
      setStatus({ type: "success", message: "Hero 3D Scene configuration updated successfully!" })
    } else {
      setStatus({ type: "error", message: res.error || "Failed to update 3D scene configuration." })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {status && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${
            status.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {status.type === "success" && <CheckCircle2 size={18} />}
          {status.message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {[
          { id: "toggles", label: "3D Models & Objects", icon: Box },
          { id: "assets", label: "GLB / HDR Assets", icon: Sparkles },
          { id: "lighting", label: "Lighting & Colors", icon: Sun },
          { id: "camera", label: "Camera & Motion", icon: Camera },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* TAB 1: 3D Objects Toggle */}
      {activeTab === "toggles" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: "show_laptop", label: "Laptop Workspace", desc: "Interactive 3D laptop with screenshot display" },
              { key: "show_ai_globe", label: "AI Sphere Globe", desc: "Glowing 3D wireframe orb & inner core" },
              { key: "show_project_cards", label: "Floating Project Cards", desc: "3D panels showing latest projects" },
              { key: "show_certificate_card", label: "Certificate Card", desc: "3D credential badge & issuer details" },
              { key: "show_hackathon_badge", label: "Hackathon Badge", desc: "Glowing competition badge & prize" },
              { key: "show_trophy", label: "Achievement Trophy", desc: "3D metallic award trophy" },
              { key: "show_github_cube", label: "GitHub Node Cube", desc: "3D rotating GitHub cube" },
              { key: "show_tech_icons", label: "Tech Stack Badges", desc: "Floating 3D technology nodes" },
              { key: "show_particles", label: "Particle System", desc: "Interactive background particle field" },
            ].map(({ key, label, desc }) => (
              <label
                key={key}
                className={`flex items-start justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  formData[key as keyof Hero3DConfig]
                    ? "bg-blue-500/10 border-blue-500/30 text-white"
                    : "bg-white/5 border-white/10 text-white/40"
                }`}
              >
                <div className="space-y-1">
                  <span className="font-semibold text-sm block">{label}</span>
                  <span className="text-xs text-white/50 block">{desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(formData[key as keyof Hero3DConfig])}
                  onChange={() => handleToggle(key as keyof Hero3DConfig)}
                  className="mt-1 h-5 w-5 rounded border-white/20 bg-black/40 text-blue-600 focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 2: Custom Assets */}
      {activeTab === "assets" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Custom GLB / GLTF Model URL</label>
              <input
                type="text"
                value={formData.custom_glb_url || ""}
                onChange={(e) => handleChange("custom_glb_url", e.target.value)}
                placeholder="https://example.com/models/developer-workspace.glb"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-white/40">Upload or provide a URL to a custom 3D model asset.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">HDR Environment Map URL</label>
              <input
                type="text"
                value={formData.hdr_environment_url || ""}
                onChange={(e) => handleChange("hdr_environment_url", e.target.value)}
                placeholder="https://example.com/hdr/studio.hdr"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-white/40">Custom 360 High-Dynamic-Range lighting map.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Environment Preset</label>
              <select
                value={formData.environment_preset || "night"}
                onChange={(e) => handleChange("environment_preset", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="night">Night Sky (Default)</option>
                <option value="city">Cyberpunk City</option>
                <option value="sunset">Neon Sunset</option>
                <option value="dawn">Soft Dawn</option>
                <option value="studio">Tech Studio</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: Lighting & Colors */}
      {activeTab === "lighting" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Background Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.background_color || "#020408"}
                  onChange={(e) => handleChange("background_color", e.target.value)}
                  className="h-10 w-16 cursor-pointer rounded-lg border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={formData.background_color || "#020408"}
                  onChange={(e) => handleChange("background_color", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Ambient Light Intensity ({formData.ambient_light_intensity})</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={formData.ambient_light_intensity || 0.4}
                onChange={(e) => handleChange("ambient_light_intensity", parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Directional Light Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.directional_light_color || "#ffffff"}
                  onChange={(e) => handleChange("directional_light_color", e.target.value)}
                  className="h-10 w-16 cursor-pointer rounded-lg border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={formData.directional_light_color || "#ffffff"}
                  onChange={(e) => handleChange("directional_light_color", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Directional Light Intensity ({formData.directional_light_intensity})</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.2"
                value={formData.directional_light_intensity || 1.5}
                onChange={(e) => handleChange("directional_light_intensity", parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 4: Camera & Motion */}
      {activeTab === "camera" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Floating Animation Speed ({formData.floating_speed}x)</label>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={formData.floating_speed || 1.0}
                onChange={(e) => handleChange("floating_speed", parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Mouse Sensitivity Lerp ({formData.mouse_sensitivity}x)</label>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={formData.mouse_sensitivity || 1.0}
                onChange={(e) => handleChange("mouse_sensitivity", parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Particle Count ({formData.particle_count})</label>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={formData.particle_count || 300}
                onChange={(e) => handleChange("particle_count", parseInt(e.target.value, 10))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Camera Position Z (Distance: {formData.camera_position_z})</label>
              <input
                type="range"
                min="4"
                max="15"
                step="0.5"
                value={formData.camera_position_z || 9}
                onChange={(e) => handleChange("camera_position_z", parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Save Button */}
      <div className="flex items-center justify-end border-t border-white/10 pt-6">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
        >
          {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          Save 3D Scene Config
        </button>
      </div>
    </form>
  )
}
