"use client"

import { useState, useTransition } from "react"
import { Plus, Trash2, Edit2, Save, X, Loader2, Compass } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { JourneyMilestone } from "@/types/about"
import {
  createJourneyMilestone,
  updateJourneyMilestone,
  deleteJourneyMilestone,
} from "@/app/admin/(protected)/actions"

interface JourneyMilestonesManagerProps {
  initialMilestones: JourneyMilestone[]
}

const COLOR_OPTIONS = [
  { label: "Blue / Purple", value: "from-blue-500 to-purple-500" },
  { label: "Cyan / Blue", value: "from-cyan-500 to-blue-500" },
  { label: "Emerald / Teal", value: "from-emerald-500 to-teal-500" },
  { label: "Purple / Pink", value: "from-purple-500 to-pink-500" },
  { label: "Orange / Amber", value: "from-orange-500 to-amber-500" },
  { label: "Rose / Red", value: "from-rose-500 to-red-500" },
]

export function JourneyMilestonesManager({ initialMilestones }: JourneyMilestonesManagerProps) {
  const [milestones, setMilestones] = useState<JourneyMilestone[]>(initialMilestones)
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [title, setTitle] = useState("")
  const [year, setYear] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("⚡")
  const [color, setColor] = useState("from-blue-500 to-purple-500")
  const [order, setOrder] = useState(0)

  function startCreate() {
    setTitle("")
    setYear("")
    setDescription("")
    setIcon("⚡")
    setColor("from-blue-500 to-purple-500")
    setOrder(milestones.length)
    setIsAdding(true)
    setEditingId(null)
    setError(null)
  }

  function startEdit(milestone: JourneyMilestone) {
    setEditingId(milestone.id)
    setTitle(milestone.title || "")
    setYear(milestone.year || "")
    setDescription(milestone.description || "")
    setIcon(milestone.icon || "⚡")
    setColor(milestone.color || "from-blue-500 to-purple-500")
    setOrder(milestone.order || 0)
    setIsAdding(false)
    setError(null)
  }

  function cancel() {
    setEditingId(null)
    setIsAdding(false)
    setError(null)
  }

  async function handleSaveNew() {
    if (!title.trim() || !year.trim() || !description.trim()) {
      setError("Title, Year, and Description are required.")
      return
    }

    const fd = new FormData()
    fd.append("title", title)
    fd.append("year", year)
    fd.append("description", description)
    fd.append("icon", icon)
    fd.append("color", color)
    fd.append("order", String(order))

    startTransition(async () => {
      const res = await createJourneyMilestone({ success: false, error: "" }, fd)
      if (res.success) {
        setIsAdding(false)
        window.location.reload()
      } else {
        setError(res.error || "Failed to create journey milestone.")
      }
    })
  }

  async function handleSaveUpdate(id: string) {
    if (!title.trim() || !year.trim() || !description.trim()) {
      setError("Title, Year, and Description are required.")
      return
    }

    const fd = new FormData()
    fd.append("title", title)
    fd.append("year", year)
    fd.append("description", description)
    fd.append("icon", icon)
    fd.append("color", color)
    fd.append("order", String(order))

    startTransition(async () => {
      const res = await updateJourneyMilestone(id, { success: false, error: "" }, fd)
      if (res.success) {
        setEditingId(null)
        window.location.reload()
      } else {
        setError(res.error || "Failed to update milestone.")
      }
    })
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this journey milestone?")) return

    startTransition(async () => {
      const res = await deleteJourneyMilestone(id)
      if (res.success) {
        setMilestones((prev) => prev.filter((item) => item.id !== id))
      } else {
        alert(res.error || "Failed to delete milestone.")
      }
    })
  }

  return (
    <div className="glass rounded-2xl border border-white/10 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="h-5 w-5 text-purple-400" />
            Journey & Learning Timeline
          </h3>
          <p className="text-xs text-white/50 mt-1">
            Manage key learning milestones that appear on your About Me and Journey pages.
          </p>
        </div>
        {!isAdding && !editingId && (
          <Button
            onClick={startCreate}
            size="sm"
            className="bg-purple-600 hover:bg-purple-500 text-white gap-2"
          >
            <Plus size={16} />
            Add Milestone
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Add New Milestone Form */}
      {isAdding && (
        <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-5 space-y-4">
          <h4 className="text-sm font-semibold text-purple-300">Add New Milestone</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-white/60 mb-1 block">Title</label>
              <Input
                placeholder="e.g. Started Full Stack Engineering"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-black/40 border-white/10 text-xs"
              />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1 block">Year / Period</label>
              <Input
                placeholder="e.g. 2024 or 2025 - Present"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-black/40 border-white/10 text-xs"
              />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1 block">Icon (Emoji/Symbol)</label>
              <Input
                placeholder="e.g. 🎓 or 🚀"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="bg-black/40 border-white/10 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1 block">Description</label>
            <Textarea
              placeholder="Detail your key milestone, achievement or learning progress..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-black/40 border-white/10 text-xs h-20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/60 mb-1 block">Badge Gradient Color</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-xs text-white"
              >
                {COLOR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-neutral-900">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1 block">Display Order</label>
              <Input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="bg-black/40 border-white/10 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="ghost" onClick={cancel} disabled={isPending}>
              <X size={14} className="mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSaveNew} disabled={isPending} className="bg-purple-600 hover:bg-purple-500">
              {isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : <Save size={14} className="mr-1" />}
              Save Milestone
            </Button>
          </div>
        </div>
      )}

      {/* List Milestones */}
      <div className="space-y-3">
        {milestones.length === 0 && !isAdding && (
          <div className="text-center py-8 text-white/40 text-sm border border-dashed border-white/10 rounded-xl">
            No journey milestones added yet. Click &quot;Add Milestone&quot; to create your first milestone!
          </div>
        )}

        {milestones.map((item) => {
          const isEditingThis = editingId === item.id

          if (isEditingThis) {
            return (
              <div key={item.id} className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 space-y-4">
                <h4 className="text-sm font-semibold text-blue-300">Edit Milestone</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Title</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-black/40 border-white/10 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Year / Period</label>
                    <Input
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="bg-black/40 border-white/10 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Icon</label>
                    <Input
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="bg-black/40 border-white/10 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1 block">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-black/40 border-white/10 text-xs h-20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Badge Gradient Color</label>
                    <select
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-xs text-white"
                    >
                      {COLOR_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-neutral-900">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Display Order</label>
                    <Input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value))}
                      className="bg-black/40 border-white/10 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button size="sm" variant="ghost" onClick={cancel} disabled={isPending}>
                    <X size={14} className="mr-1" /> Cancel
                  </Button>
                  <Button size="sm" onClick={() => handleSaveUpdate(item.id)} disabled={isPending} className="bg-blue-600 hover:bg-blue-500">
                    {isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : <Save size={14} className="mr-1" />}
                    Update Milestone
                  </Button>
                </div>
              </div>
            )
          }

          return (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/20"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-lg shadow-md`}
                >
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-purple-300 border border-white/10">
                      {item.year}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mt-1 line-clamp-2">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => startEdit(item)}
                  disabled={isPending}
                  className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Edit2 size={14} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(item.id)}
                  disabled={isPending}
                  className="h-8 w-8 text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
