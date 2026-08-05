"use client"

import { useState, useTransition } from "react"
import { Plus, Trash2, Edit2, Save, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { AboutStat } from "@/types/about"
import { createAboutStat, updateAboutStat, deleteAboutStat } from "@/app/admin/(protected)/actions"

interface AboutStatsManagerProps {
  initialStats: AboutStat[]
}

export function AboutStatsManager({ initialStats }: AboutStatsManagerProps) {
  const [stats, setStats] = useState<AboutStat[]>(initialStats)
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [icon, setIcon] = useState("🚀")
  const [value, setValue] = useState("")
  const [label, setLabel] = useState("")
  const [color, setColor] = useState("from-blue-500 to-purple-500")
  const [order, setOrder] = useState(0)

  function startCreate() {
    setIcon("🚀")
    setValue("")
    setLabel("")
    setColor("from-blue-500 to-purple-500")
    setOrder(stats.length)
    setIsAdding(true)
    setEditingId(null)
    setError(null)
  }

  function startEdit(stat: AboutStat) {
    setEditingId(stat.id)
    setIcon(stat.icon || "🚀")
    setValue(stat.value || "")
    setLabel(stat.label || "")
    setColor(stat.color || "from-blue-500 to-purple-500")
    setOrder(stat.order || 0)
    setIsAdding(false)
    setError(null)
  }

  function cancel() {
    setEditingId(null)
    setIsAdding(false)
    setError(null)
  }

  async function handleSaveNew() {
    if (!value.trim() || !label.trim()) {
      setError("Value and Label are required.")
      return
    }

    const fd = new FormData()
    fd.append("icon", icon)
    fd.append("value", value)
    fd.append("label", label)
    fd.append("color", color)
    fd.append("order", String(order))

    startTransition(async () => {
      const res = await createAboutStat({ success: false, error: "" }, fd)
      if (res.success) {
        setIsAdding(false)
        window.location.reload()
      } else {
        setError(res.error || "Failed to create stat card.")
      }
    })
  }

  async function handleSaveUpdate(id: string) {
    if (!value.trim() || !label.trim()) {
      setError("Value and Label are required.")
      return
    }

    const fd = new FormData()
    fd.append("icon", icon)
    fd.append("value", value)
    fd.append("label", label)
    fd.append("color", color)
    fd.append("order", String(order))

    startTransition(async () => {
      const res = await updateAboutStat(id, { success: false, error: "" }, fd)
      if (res.success) {
        setEditingId(null)
        window.location.reload()
      } else {
        setError(res.error || "Failed to update stat card.")
      }
    })
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this stat card?")) return

    startTransition(async () => {
      const res = await deleteAboutStat(id)
      if (res.success) {
        setStats((prev) => prev.filter((s) => s.id !== id))
      } else {
        setError(res.error || "Failed to delete stat card.")
      }
    })
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">About Me Key Stats & Metrics</h3>
          <p className="text-xs text-white/50">Manage the 6 metrics shown on your About Me page (e.g. 50+ Projects Completed)</p>
        </div>
        {!isAdding && (
          <Button type="button" size="sm" variant="gradient" onClick={startCreate} className="gap-2 text-xs">
            <Plus size={14} /> Add Metric Card
          </Button>
        )}
      </div>

      {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>}

      {/* Adding Form */}
      {isAdding && (
        <div className="p-4 rounded-xl bg-white/5 border border-blue-500/30 space-y-4">
          <h4 className="text-xs font-semibold text-blue-400">New Stat Card</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] text-white/50 block mb-1">Icon (Emoji)</label>
              <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🚀" className="text-center text-lg" />
            </div>
            <div>
              <label className="text-[11px] text-white/50 block mb-1">Value *</label>
              <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="50+" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] text-white/50 block mb-1">Label *</label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Projects Completed" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button type="button" size="sm" variant="ghost" onClick={cancel} disabled={isPending}>
              <X size={14} className="mr-1" /> Cancel
            </Button>
            <Button type="button" size="sm" variant="gradient" onClick={handleSaveNew} disabled={isPending}>
              {isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : <Save size={14} className="mr-1" />}
              Save Metric
            </Button>
          </div>
        </div>
      )}

      {/* List of About Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map((stat) => {
          const isEditing = editingId === stat.id

          if (isEditing) {
            return (
              <div key={stat.id} className="p-4 rounded-xl bg-white/5 border border-purple-500/30 space-y-3 col-span-full">
                <h4 className="text-xs font-semibold text-purple-400">Editing Stat Card</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] text-white/50 block mb-1">Icon (Emoji)</label>
                    <Input value={icon} onChange={(e) => setIcon(e.target.value)} className="text-center text-lg" />
                  </div>
                  <div>
                    <label className="text-[11px] text-white/50 block mb-1">Value *</label>
                    <Input value={value} onChange={(e) => setValue(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-white/50 block mb-1">Label *</label>
                    <Input value={label} onChange={(e) => setLabel(e.target.value)} />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button type="button" size="sm" variant="ghost" onClick={cancel} disabled={isPending}>
                    <X size={14} className="mr-1" /> Cancel
                  </Button>
                  <Button type="button" size="sm" variant="gradient" onClick={() => handleSaveUpdate(stat.id)} disabled={isPending}>
                    {isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : <Save size={14} className="mr-1" />}
                    Update Card
                  </Button>
                </div>
              </div>
            )
          }

          return (
            <div
              key={stat.id}
              className="glass rounded-xl p-4 border border-white/10 flex items-center justify-between gap-3 group hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0">{stat.icon}</span>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-white leading-none">{stat.value}</p>
                  <p className="text-xs text-white/55 leading-snug truncate mt-0.5">{stat.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => startEdit(stat)}
                  className="p-1.5 rounded-lg text-white/50 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(stat.id)}
                  className="p-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}

        {!stats.length && !isAdding && (
          <div className="col-span-full py-8 text-center text-xs text-white/40 border border-dashed border-white/10 rounded-xl">
            No stat cards added yet. Click "Add Metric Card" to create your metrics!
          </div>
        )}
      </div>
    </div>
  )
}
